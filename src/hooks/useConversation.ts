import { useState, useEffect, useCallback } from 'react'
import { TavusService, TavusConversation } from '../lib/tavus'
import { LLMAnalysisService, InterviewAnalysis } from '../lib/llmAnalysis'

export interface ConversationState {
  isConnected: boolean
  isRecording: boolean
  isVideoEnabled: boolean
  sessionDuration: number
  agentConnected: boolean
  avatarUrl?: string
  error?: string
  conversationId?: string
}

export interface ConversationConfig {
  role: string
  company: string
  interviewType: 'Technical' | 'Behavioral' | 'System Design'
  duration: number
  resume: string
  jobDescription: string
  additionalNotes: string
  userId: string
}

export interface ConversationMessage {
  timestamp: number
  speaker: 'user' | 'agent'
  content: string
}

export function useConversation() {
  const [state, setState] = useState<ConversationState>({
    isConnected: false,
    isRecording: false,
    isVideoEnabled: true,
    sessionDuration: 0,
    agentConnected: false,
  })

  const [tavusService] = useState(() => new TavusService())
  const [tavusConversation, setTavusConversation] = useState<TavusConversation | null>(null)
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([])
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null)
  const [llmAnalysisService] = useState(() => new LLMAnalysisService())

  // Session duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state.isConnected && state.isRecording) {
      interval = setInterval(() => {
        setState(prev => ({ ...prev, sessionDuration: prev.sessionDuration + 1 }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state.isConnected, state.isRecording])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event) => {
        const results = Array.from(event.results)
        const transcript = results
          .map(result => result[0].transcript)
          .join('')
        
        // Only add final results to avoid duplicates
        if (event.results[event.results.length - 1].isFinal && transcript.trim()) {
          addConversationMessage('user', transcript.trim())
        }
      }
      
      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
      }
      
      setSpeechRecognition(recognition)
    }
  }, [])

  const addConversationMessage = useCallback((speaker: 'user' | 'agent', content: string) => {
    setConversationMessages(prev => [...prev, {
      timestamp: Date.now(),
      speaker,
      content
    }])
  }, [])

  const startConversation = useCallback(async (config: ConversationConfig) => {
    try {
      setState(prev => ({ ...prev, error: undefined }))
      setConversationMessages([])

      // Check if Tavus is properly configured
      if (!import.meta.env.VITE_TAVUS_API_KEY) {
        console.warn('Tavus API key not configured, using mock conversation')
        console.log('Available env vars:', {
          hasApiKey: !!import.meta.env.VITE_TAVUS_API_KEY,
          hasReplicaId: !!import.meta.env.VITE_TAVUS_DEFAULT_REPLICA_ID,
          supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL
        })
        // Set up a mock conversation for development
        setState(prev => ({ 
          ...prev, 
          avatarUrl: undefined, // This will show the placeholder
          isConnected: true,
          sessionDuration: 0,
          conversationId: 'mock-conversation-id'
        }))
        
        setTimeout(() => {
          setState(prev => ({ 
            ...prev, 
            agentConnected: true,
            isRecording: true
          }))
          addConversationMessage('agent', getInitialGreeting(config))
        }, 2000)
        
        return
      }

      // Create Tavus conversation for avatar
      try {
        const avatarId = tavusService.getAvatarForInterview()
        console.log('Creating Tavus conversation with:', {
          avatarId,
          hasApiKey: !!import.meta.env.VITE_TAVUS_API_KEY,
          apiKeyLength: import.meta.env.VITE_TAVUS_API_KEY?.length || 0
        })
        
        // Create the enhanced greeting for the specific interview type
        const enhancedGreeting = getEnhancedGreeting(config)
        console.log('Enhanced greeting created, length:', enhancedGreeting.length)
        
        const tavusConv = await tavusService.createConversation({
          replica_id: avatarId,
          conversation_name: `${config.role} Interview - ${config.company}`,
          custom_greeting: enhancedGreeting,
        })
        
        console.log('Tavus conversation created successfully:', {
          conversationId: tavusConv.conversation_id,
          conversationUrl: tavusConv.conversation_url,
          status: tavusConv.status
        })

        setTavusConversation(tavusConv)
        setState(prev => ({ 
          ...prev, 
          avatarUrl: tavusConv.conversation_url,
          isConnected: true,
          sessionDuration: 0,
          conversationId: tavusConv.conversation_id
        }))
      } catch (tavusError) {
        console.warn('Tavus conversation creation failed, using fallback:', tavusError)
        // Fallback to mock conversation if Tavus fails
        setState(prev => ({ 
          ...prev, 
          avatarUrl: undefined,
          isConnected: true,
          sessionDuration: 0,
          conversationId: 'fallback-conversation-id'
        }))
      }

      // Simulate agent connection after a short delay
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          agentConnected: true,
          isRecording: true // Auto-start recording when agent connects
        }))
        
        // Add initial greeting to conversation log
        addConversationMessage('agent', getInitialGreeting(config))
      }, 2000)

    } catch (error) {
      console.error('Error starting conversation:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start conversation' 
      }))
    }
  }, [tavusService, addConversationMessage])

  const getEnhancedGreeting = (config: ConversationConfig): string => {
    // Create a simple, natural greeting without exposing internal instructions
    const greetings = {
      'Technical': `Hello! I'm your interviewer from ${config.company}. I'll be conducting your technical interview for the ${config.role} position today. I've reviewed your background and our job requirements. Let's start with a coding problem relevant to the work you'd be doing in this role.`,
      'Behavioral': `Hello! I'm your interviewer from ${config.company}. I'll be conducting your behavioral interview for the ${config.role} position today. I've reviewed your resume and our role requirements. Let's begin - tell me about a challenging project you've worked on that demonstrates skills relevant to this position.`,
      'System Design': `Hello! I'm your interviewer from ${config.company}. I'll be conducting your system design interview for the ${config.role} position today. I've reviewed your experience and our technical requirements. Let's start with designing a system that would be relevant to the challenges we face at ${config.company}.`
    }
    
    return greetings[config.interviewType] || greetings['Technical']
  }

  const getInterviewTypePrompt = (interviewType: string, role: string, company: string): string => {
    const prompts = {
      'Technical': `For this technical interview, focus on:
- Coding problems and algorithms relevant to the ${role} position
- Technologies and frameworks mentioned in their background
- Problem-solving approach and technical communication
- Practical scenarios they'd encounter at ${company}

Start with: "Let's begin with a technical question relevant to the ${role} position."`,
      
      'Behavioral': `For this behavioral interview, focus on:
- Past experiences and how they handled specific situations
- Leadership, teamwork, and problem-solving examples
- Cultural fit and motivation for joining ${company}
- Challenges relevant to the ${role} position

Start with: "Let's start by discussing your background. Tell me about a challenging project you've worked on that's relevant to this ${role} role."`,
      
      'System Design': `For this system design interview, focus on:
- Architectural challenges relevant to ${company}'s scale
- Scalability and performance considerations
- Design trade-offs and technical decisions
- Real-world scenarios for the ${role} position

Start with: "Let's begin with a system design challenge. How would you design a system that ${company} might need for their operations?"`
    }
    
    return prompts[interviewType as keyof typeof prompts] || prompts['Technical']
  }

  const getInitialGreeting = (config: ConversationConfig): string => {
    const greetings = {
      'Technical': `Hello! I'm your interviewer from ${config.company}. I'll be conducting your technical interview for the ${config.role} position today. I've reviewed your background and our job requirements. Let's start with a coding problem relevant to the work you'd be doing in this role.`,
      'Behavioral': `Hello! I'm your interviewer from ${config.company}. I'll be conducting your behavioral interview for the ${config.role} position today. I've reviewed your resume and our role requirements. Let's begin - tell me about a challenging project you've worked on that demonstrates skills relevant to this position.`,
      'System Design': `Hello! I'm your interviewer from ${config.company}. I'll be conducting your system design interview for the ${config.role} position today. I've reviewed your experience and our technical requirements. Let's start with designing a system that would be relevant to the challenges we face at ${config.company}.`
    }
    
    return greetings[config.interviewType] || greetings['Technical']
  }

  const toggleRecording = useCallback(async () => {
    try {
      const newRecordingState = !state.isRecording
      
      if (newRecordingState && speechRecognition) {
        // Start speech recognition when recording starts
        speechRecognition.start()
      } else if (!newRecordingState && speechRecognition) {
        // Stop speech recognition when recording stops
        speechRecognition.stop()
      }
      
      setState(prev => ({ ...prev, isRecording: newRecordingState }))
    } catch (error) {
      console.error('Error toggling recording:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to toggle recording' 
      }))
    }
  }, [state.isRecording, speechRecognition])

  const toggleVideo = useCallback(() => {
    setState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))
  }, [])

  const endConversation = useCallback(async () => {
    try {
      // Stop speech recognition
      if (speechRecognition) {
        speechRecognition.stop()
      }
      
      // End Tavus conversation
      if (tavusConversation) {
        await tavusService.endConversation(tavusConversation.conversation_id)
        setTavusConversation(null)
      }

      setState({
        isConnected: false,
        isRecording: false,
        isVideoEnabled: true,
        sessionDuration: 0,
        agentConnected: false,
        avatarUrl: undefined,
        error: undefined,
        conversationId: undefined,
      })

    } catch (error) {
      console.error('Error ending conversation:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to end conversation' 
      }))
    }
  }, [tavusService, tavusConversation, speechRecognition])

  const generateConversationSummary = useCallback(async (role: string, company: string, interviewType: string) => {
    // Try to get actual transcript from Tavus first
    if (tavusConversation) {
      try {
        const transcriptMessages = await tavusService.getConversationTranscriptMessages(tavusConversation.conversation_id)
        
        if (transcriptMessages && transcriptMessages.length > 1) {
          // Use LLM analysis for real transcript
          const analysis = await llmAnalysisService.analyzeInterview({
            transcript: transcriptMessages,
            role,
            company,
            interviewType,
            duration: state.sessionDuration,
            resume: '', // Would need to pass this from conversation config
            jobDescription: '' // Would need to pass this from conversation config
          })
          
          return {
            summary: analysis.feedback,
            score: analysis.score,
            analysis: analysis
          }
        }
      } catch (error) {
        console.warn('LLM analysis failed, using fallback:', error)
      }
    }
    
    // Fallback to captured conversation messages
    if (conversationMessages.length > 0) {
      const fallbackSummary = generateSummaryFromMessages(conversationMessages, role, company, interviewType, state.sessionDuration)
      return {
        summary: fallbackSummary,
        score: null,
        analysis: null
      }
    }
    
    return {
      summary: null,
      score: null,
      analysis: null
    }
  }, [conversationMessages, tavusService, tavusConversation, state.sessionDuration, llmAnalysisService])

  const generateSummaryFromMessages = (messages: ConversationMessage[], role: string, company: string, interviewType: string, duration: number): string => {
    const userMessages = messages.filter(m => m.speaker === 'user').map(m => m.content)
    const agentMessages = messages.filter(m => m.speaker === 'agent').map(m => m.content)
    
    const conversationLength = Math.floor(duration / 60)
    let summary = `Completed a ${conversationLength} minute ${interviewType.toLowerCase()} interview for the ${role} position at ${company}. `
    
    // Analyze the actual conversation content
    if (userMessages.length > 0) {
      const allUserText = userMessages.join(' ').toLowerCase()
      const keyTopics = extractInterviewTopicsFromText(allUserText, interviewType)
      
      if (keyTopics.length > 0) {
        summary += `The interview covered ${keyTopics.join(', ')}. `
      }
      
      // Add specific insights based on interview type
      if (interviewType === 'Technical') {
        if (allUserText.includes('algorithm') || allUserText.includes('code') || allUserText.includes('system')) {
          summary += `Technical concepts and problem-solving approaches were thoroughly discussed. `
        }
      } else if (interviewType === 'Behavioral') {
        if (allUserText.includes('experience') || allUserText.includes('challenge') || allUserText.includes('team')) {
          summary += `Behavioral scenarios and past experiences were explored in detail. `
        }
      } else if (interviewType === 'System Design') {
        if (allUserText.includes('scale') || allUserText.includes('architecture') || allUserText.includes('design')) {
          summary += `System architecture and scalability considerations were key focus areas. `
        }
      }
    }
    
    // Add insights from agent responses if available
    if (agentMessages.length > 1) { // More than just the greeting
      summary += `The interviewer provided valuable feedback and asked insightful questions that helped assess fit for the role. `
    }
    
    summary += `The interview provided valuable insights into the candidate's qualifications and potential fit for the ${role} position.`
    
    return summary
  }

  const extractInterviewTopicsFromText = (text: string, interviewType: string): string[] => {
    const topics: string[] = []
    
    // Common interview topics by type
    const topicPatterns = [
      { keywords: ['algorithm', 'code', 'programming', 'technical'], topic: 'technical skills' },
      { keywords: ['experience', 'project', 'work', 'career'], topic: 'work experience' },
      { keywords: ['challenge', 'problem', 'solve', 'difficulty'], topic: 'problem solving' },
      { keywords: ['team', 'collaboration', 'leadership', 'management'], topic: 'teamwork' },
      { keywords: ['system', 'architecture', 'design', 'scale'], topic: 'system design' },
      { keywords: ['database', 'api', 'backend', 'frontend'], topic: 'technical architecture' },
      { keywords: ['motivation', 'goal', 'achievement', 'success'], topic: 'motivation' },
      { keywords: ['communication', 'presentation', 'explain'], topic: 'communication skills' }
    ]
    
    topicPatterns.forEach(pattern => {
      if (pattern.keywords.some(keyword => text.includes(keyword))) {
        topics.push(pattern.topic)
      }
    })
    
    return topics.slice(0, 3) // Return up to 3 topics
  }

  return {
    state,
    tavusConversation,
    conversationMessages,
    startConversation,
    toggleRecording,
    toggleVideo,
    endConversation,
    generateConversationSummary,
  }
}