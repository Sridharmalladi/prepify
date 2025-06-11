const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY || ''
const TAVUS_API_BASE = 'https://tavusapi.com'

export interface TavusAvatar {
  avatar_id: string
  avatar_name: string
  avatar_url?: string
}

export interface TavusConversation {
  conversation_id: string
  conversation_url: string
  status: 'active' | 'ended' | 'error'
}

export interface CreateConversationRequest {
  replica_id: string
  persona_id?: string
  callback_url?: string
  conversation_name?: string
  custom_greeting?: string
  max_call_duration?: number
}

export class TavusService {
  private apiKey: string

  constructor() {
    this.apiKey = TAVUS_API_KEY
    if (!this.apiKey) {
      console.warn('Tavus API key not found. Avatar features will be disabled.')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${TAVUS_API_BASE}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Tavus API error: ${response.status} - ${error}`)
    }

    // Handle responses that don't return JSON (like 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null
    }

    // Only parse JSON if there's content to parse
    return response.json()
  }

  async getAvailableAvatars(): Promise<TavusAvatar[]> {
    try {
      const response = await this.makeRequest('/v2/avatars')
      return response.data || []
    } catch (error) {
      console.error('Error fetching Tavus avatars:', error)
      return []
    }
  }

  async createConversation(request: CreateConversationRequest): Promise<TavusConversation> {
    try {
      // First, try to end any existing conversations to avoid concurrent limit issues
      await this.endAllActiveConversations()
      
      const response = await this.makeRequest('/v2/conversations', {
        method: 'POST',
        body: JSON.stringify(request),
      })
      
      return {
        conversation_id: response.conversation_id,
        conversation_url: response.conversation_url,
        status: response.status || 'active',
      }
    } catch (error) {
      console.error('Error creating Tavus conversation:', error)
      throw error
    }
  }

  async getAllConversations(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/v2/conversations')
      return response.data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  async endAllActiveConversations(): Promise<void> {
    try {
      const conversations = await this.getAllConversations()
      const activeConversations = conversations.filter(conv => 
        conv.status === 'active' || conv.status === 'starting'
      )
      
      // End all active conversations
      await Promise.all(
        activeConversations.map(conv => 
          this.endConversation(conv.conversation_id).catch(err => 
            console.warn(`Failed to end conversation ${conv.conversation_id}:`, err)
          )
        )
      )
      
      if (activeConversations.length > 0) {
        console.log(`Ended ${activeConversations.length} active conversations`)
      }
    } catch (error) {
      console.warn('Error ending active conversations:', error)
      // Don't throw here - we want to continue with creating new conversation
    }
  }

  async endConversation(conversationId: string): Promise<void> {
    try {
      await this.makeRequest(`/v2/conversations/${conversationId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error ending Tavus conversation:', error)
      throw error
    }
  }

  async getConversationStatus(conversationId: string): Promise<TavusConversation> {
    try {
      const response = await this.makeRequest(`/v2/conversations/${conversationId}`)
      return {
        conversation_id: response.conversation_id,
        conversation_url: response.conversation_url,
        status: response.status,
      }
    } catch (error) {
      console.error('Error getting conversation status:', error)
      throw error
    }
  }

  async getConversationTranscript(conversationId: string): Promise<string | null> {
    try {
      // Get conversation details with verbose=true to include transcript
      const response = await this.makeRequest(`/v2/conversations/${conversationId}?verbose=true`)
      
      if (response && response.transcript) {
        return JSON.stringify(response.transcript)
      }
      
      return null
    } catch (error) {
      console.warn('Could not fetch conversation transcript:', error)
      return null
    }
  }

  async getConversationTranscriptMessages(conversationId: string): Promise<any[] | null> {
    try {
      // Get conversation details with verbose=true to include transcript
      const response = await this.makeRequest(`/v2/conversations/${conversationId}?verbose=true`)
      
      if (response && response.transcript && Array.isArray(response.transcript)) {
        return response.transcript
      }
      
      return null
    } catch (error) {
      console.warn('Could not fetch conversation transcript messages:', error)
      return null
    }
  }

  async generateConversationSummary(conversationId: string, role: string, company: string, interviewType: string, duration: number): Promise<string> {
    try {
      // First, try to get the actual transcript
      const transcript = await this.getConversationTranscript(conversationId)
      
      if (transcript && transcript.length > 50) {
        // If we have a substantial transcript, create a summary based on it
        return this.createSummaryFromTranscript(transcript, role, company, interviewType, duration)
      }
      
      // If no transcript available, create a personalized summary based on the session
      return this.createPersonalizedSummary(role, company, interviewType, duration)
      
    } catch (error) {
      console.warn('Error generating conversation summary:', error)
      return this.createPersonalizedSummary(role, company, interviewType, duration)
    }
  }

  private createSummaryFromTranscript(transcript: string, role: string, company: string, interviewType: string, duration: number): string {
    // Extract key themes and topics from the transcript
    const words = transcript.toLowerCase().split(/\s+/)
    const keyTopics = this.extractKeyTopics(words, interviewType)
    const conversationLength = Math.floor(duration / 60)
    
    // Create a more personalized summary based on the actual interview
    let summary = `Completed a ${conversationLength} minute ${interviewType.toLowerCase()} interview for the ${role} position at ${company}. `
    
    if (keyTopics.length > 0) {
      summary += `The interview covered ${keyTopics.join(', ')}. `
    }
    
    // Add some insights based on the interview type
    summary += this.getInsightsByInterviewType(interviewType)
    
    // Add a note about the interview being based on actual interaction
    summary += ` The interview provided valuable insights into the candidate's qualifications and readiness for the role.`
    
    return summary
  }

  private createPersonalizedSummary(role: string, company: string, interviewType: string, duration: number): string {
    const conversationLength = Math.floor(duration / 60)
    
    // Create a dynamic interview summary
    const openings = [
      `Completed a comprehensive ${conversationLength} minute ${interviewType.toLowerCase()} interview`,
      `Participated in a ${conversationLength} minute ${interviewType.toLowerCase()} interview session`,
      `Engaged in a ${conversationLength} minute ${interviewType.toLowerCase()} interview`,
      `Conducted a ${conversationLength} minute ${interviewType.toLowerCase()} interview`
    ]
    
    const opening = openings[Math.floor(Math.random() * openings.length)]
    let summary = `${opening} for the ${role} position at ${company}. `
    
    // Add specific insights based on interview type
    summary += this.getInsightsByInterviewType(interviewType)
    
    // Add a personalized closing
    const closings = [
      `The interview provided valuable insights into technical competencies and cultural fit.`,
      `This session offered a comprehensive assessment of qualifications and potential.`,
      `The discussion revealed key strengths and areas for professional development.`,
      `The interview highlighted relevant experience and problem-solving capabilities.`
    ]
    
    summary += ` ${closings[Math.floor(Math.random() * closings.length)]}`
    
    return summary
  }

  private extractKeyTopics(words: string[], interviewType: string): string[] {
    const topicKeywords: Record<string, string[]> = {
      'Technical': ['algorithm', 'code', 'programming', 'system', 'database', 'api', 'architecture', 'performance'],
      'Behavioral': ['experience', 'challenge', 'team', 'leadership', 'conflict', 'communication', 'motivation', 'goal'],
      'System Design': ['scalability', 'architecture', 'database', 'microservices', 'load', 'performance', 'design', 'system']
    }
    
    const relevantKeywords = topicKeywords[interviewType] || []
    const foundTopics: string[] = []
    
    relevantKeywords.forEach(keyword => {
      if (words.includes(keyword) && !foundTopics.includes(keyword)) {
        foundTopics.push(keyword)
      }
    })
    
    return foundTopics.slice(0, 3) // Return up to 3 key topics
  }

  private getInsightsByInterviewType(interviewType: string): string {
    const insights: Record<string, string[]> = {
      'Technical': [
        'The interview assessed problem-solving skills and technical knowledge depth.',
        'Code quality, algorithmic thinking, and system understanding were evaluated.',
        'Technical communication and ability to explain complex concepts were tested.',
        'The session explored practical experience with relevant technologies and frameworks.'
      ],
      'Behavioral': [
        'The interview explored past experiences and behavioral patterns in professional settings.',
        'Leadership potential, teamwork skills, and conflict resolution abilities were assessed.',
        'Communication style, cultural fit, and motivation factors were evaluated.',
        'The session revealed insights into work style and professional values.'
      ],
      'System Design': [
        'The interview evaluated system architecture and scalability thinking.',
        'Design trade-offs, performance considerations, and technical decision-making were assessed.',
        'The session explored experience with large-scale systems and distributed architectures.',
        'Problem decomposition and systematic thinking capabilities were demonstrated.'
      ]
    }
    
    const typeInsights = insights[interviewType]
    if (typeInsights) {
      return typeInsights[Math.floor(Math.random() * typeInsights.length)]
    }
    
    // Default insight if type not found
    return `The interview provided valuable insights into the candidate's qualifications and potential.`
  }

  // Helper method to get avatar for interview
  getAvatarForInterview(): string {
    // Use a professional interviewer avatar - check if we have the required environment variables
    const defaultReplicaId = import.meta.env.VITE_TAVUS_DEFAULT_REPLICA_ID

    if (!defaultReplicaId) {
      console.error('Tavus replica ID not configured. Please set VITE_TAVUS_DEFAULT_REPLICA_ID in your environment variables.')
      console.log('Current environment check:', {
        hasApiKey: !!import.meta.env.VITE_TAVUS_API_KEY,
        hasReplicaId: !!import.meta.env.VITE_TAVUS_DEFAULT_REPLICA_ID,
        nodeEnv: import.meta.env.NODE_ENV,
        mode: import.meta.env.MODE
      })
      // Return a fallback that won't cause the iframe to fail
      throw new Error('Tavus replica ID not configured. Please check your environment variables.')
    }

    console.log('Using Tavus replica ID:', defaultReplicaId)
    return defaultReplicaId
  }
}

const getTavusGreeting = (config: ConversationConfig): string => {
  const basePrompt = `You are a professional interviewer from ${config.company} conducting a ${config.interviewType.toLowerCase()} interview for the ${config.role} position.

INTERVIEW CONTEXT:
- Company: ${config.company}
- Role: ${config.role}
- Interview Type: ${config.interviewType}
- Duration: ${config.duration} minutes
- Candidate's Resume: ${config.resume.substring(0, 500)}...
- Job Requirements: ${config.jobDescription.substring(0, 500)}...
${config.additionalNotes ? `- Additional Context: ${config.additionalNotes}` : ''}

CRITICAL INSTRUCTIONS:
1. You are ONLY an interviewer - do not ask what the candidate wants to discuss
2. Ask specific, relevant interview questions based on the role and company
3. Use the resume and job description to ask personalized questions
4. Stay focused on interview topics - no casual conversation
5. Be professional, direct, and purposeful with every question
6. Evaluate the candidate's fit for this specific role at ${config.company}

${getInterviewTypeInstructions(config.interviewType, config.role, config.company)}

START IMMEDIATELY with a relevant interview question after your greeting. Do not ask what they want to discuss.`

  const greetings = {
    'Technical': `${basePrompt}

GREETING: "Hello! I'm your interviewer from ${config.company}. I'll be conducting your technical interview for the ${config.role} position. I've reviewed your background and our requirements. Let's start with a coding problem relevant to our work."`,
    
    'Behavioral': `${basePrompt}

GREETING: "Hello! I'm your interviewer from ${config.company}. I'll be conducting your behavioral interview for the ${config.role} position. I've reviewed your resume and our role requirements. Let's begin - tell me about a challenging project you've worked on that's relevant to this role."`,
    
    'System Design': `${basePrompt}

GREETING: "Hello! I'm your interviewer from ${config.company}. I'll be conducting your system design interview for the ${config.role} position. I've reviewed your experience and our technical needs. Let's start with designing a system that's relevant to our challenges at ${config.company}."`
  }
  
  return greetings[config.interviewType] || greetings['Technical']
}

const getInterviewTypeInstructions = (interviewType: string, role: string, company: string): string => {
  const instructions = {
    'Technical': `
TECHNICAL INTERVIEW FOCUS:
- Ask coding problems relevant to the ${role} position
- Test algorithms, data structures, and problem-solving
- Discuss technologies mentioned in their resume and job requirements
- Ask about system architecture and technical trade-offs
- Evaluate debugging and optimization skills
- Focus on practical coding scenarios they'd face at ${company}
- Ask follow-up questions about their technical choices

SAMPLE QUESTION FLOW:
1. Start with a coding problem
2. Ask about their approach and complexity analysis
3. Discuss technologies from their background
4. Present architecture challenges
5. Evaluate their technical communication`,

    'Behavioral': `
BEHAVIORAL INTERVIEW FOCUS:
- Ask about specific experiences from their resume
- Use STAR method (Situation, Task, Action, Result) evaluation
- Focus on leadership, teamwork, and problem-solving scenarios
- Ask about challenges relevant to the ${role} position
- Evaluate cultural fit for ${company}
- Discuss their motivation for this specific role
- Ask about conflict resolution and communication

SAMPLE QUESTION FLOW:
1. Ask about relevant project experience
2. Explore leadership and teamwork scenarios
3. Discuss challenges and how they overcame them
4. Evaluate their interest in ${company} and the role
5. Ask about their career goals and growth`,

    'System Design': `
SYSTEM DESIGN INTERVIEW FOCUS:
- Present large-scale system design challenges relevant to ${company}
- Evaluate architectural thinking and scalability considerations
- Discuss database design and data modeling
- Ask about distributed systems and microservices
- Evaluate trade-offs between different approaches
- Focus on real-world scenarios they'd face in the ${role}
- Test their understanding of performance and reliability

SAMPLE QUESTION FLOW:
1. Present a system design problem relevant to ${company}
2. Ask about requirements gathering and clarification
3. Evaluate their architectural approach
4. Discuss scalability and performance considerations
5. Explore trade-offs and alternative solutions`
  }

  return instructions[interviewType as keyof typeof instructions] || instructions['Technical']
}