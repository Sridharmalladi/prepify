import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Clock, Save, AlertCircle, Briefcase, Play, Pause } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useConversation } from '../hooks/useConversation'
import { AvatarDisplay } from '../components/AvatarDisplay'

export function ChatPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { state, tavusConversation, conversationMessages, startConversation, toggleRecording, toggleVideo, endConversation, generateConversationSummary } = useConversation()
  const [conversationSummary, setConversationSummary] = useState('')
  const [interviewScore, setInterviewScore] = useState<number | null>(null)
  const [interviewAnalysis, setInterviewAnalysis] = useState<any>(null)
  const [isEnding, setIsEnding] = useState(false)

  const role = searchParams.get('role') || ''
  const company = searchParams.get('company') || ''
  const interviewType = searchParams.get('interviewType') as 'Technical' | 'Behavioral' | 'System Design' || 'Technical'
  const duration = parseInt(searchParams.get('duration') || '30')
  const resume = searchParams.get('resume') || ''
  const jobDescription = searchParams.get('jobDescription') || ''
  const additionalNotes = searchParams.get('additionalNotes') || ''

  const handleStartInterview = async () => {
    if (!user || !role || !company || !interviewType || !resume || !jobDescription) return

    try {
      await startConversation({
        role,
        company,
        interviewType,
        duration,
        resume,
        jobDescription,
        additionalNotes,
        userId: user.id,
      })
    } catch (error) {
      console.error('Failed to start interview:', error)
    }
  }

  const handleEndInterview = async () => {
    setIsEnding(true)
    
    try {
      // Generate interview summary from Tavus if available
      let result = { summary: '', score: null, analysis: null }
      try {
        const generatedResult = await generateConversationSummary(role, company, interviewType)
        result = generatedResult || { 
          summary: generateFallbackSummary(role, company, interviewType, state.sessionDuration),
          score: null,
          analysis: null
        }
      } catch (error) {
        console.warn('Could not generate Tavus summary, using fallback:', error)
        result = {
          summary: generateFallbackSummary(role, company, interviewType, state.sessionDuration),
          score: null,
          analysis: null
        }
      }
      
      // End the interview after getting the summary
      await endConversation()
      
      setConversationSummary(result.summary || generateFallbackSummary(role, company, interviewType, state.sessionDuration))
      setInterviewScore(result.score)
      setInterviewAnalysis(result.analysis)
      
      // Save to interview sessions
      if (user) {
        try {
          const { error } = await supabase
            .from('interview_sessions')
            .insert({
              user_id: user.id,
              role,
              company,
              interview_type: interviewType,
              duration,
              resume,
              job_description: jobDescription,
              additional_notes: additionalNotes,
              summary: result.summary || generateFallbackSummary(role, company, interviewType, state.sessionDuration),
              score: result.score
            })

          if (error) throw error
          
          // Navigate back to dashboard after a delay
          setTimeout(() => {
            navigate('/dashboard')
          }, 3000)
        } catch (error) {
          console.error('Error saving interview session:', error)
        }
      }
    } catch (error) {
      console.error('Error ending interview:', error)
    } finally {
      setIsEnding(false)
    }
  }

  const handleToggleRecording = async () => {
    try {
      await toggleRecording()
    } catch (error) {
      console.error('Error toggling recording:', error)
    }
  }

  const handleToggleVideo = () => {
    toggleVideo()
  }

  const generateFallbackSummary = (role: string, company: string, interviewType: string, duration: number) => {
    const interviewLength = Math.floor(duration / 60)
    
    const summaries = {
      'Technical': `Completed a comprehensive ${interviewLength} minute technical interview for the ${role} position at ${company}. The session covered coding challenges, algorithmic thinking, and system design concepts. Technical problem-solving skills were assessed through practical coding exercises and architectural discussions. The interview provided valuable insights into technical competencies and approach to complex engineering problems.`,
      'Behavioral': `Participated in a ${interviewLength} minute behavioral interview for the ${role} role at ${company}. The discussion explored past experiences, leadership scenarios, and cultural fit assessment. Key topics included teamwork, conflict resolution, and professional growth experiences. The interview revealed important insights about work style, values, and potential contribution to the team.`,
      'System Design': `Engaged in a ${interviewLength} minute system design interview for the ${role} position at ${company}. The session focused on architectural thinking, scalability considerations, and design trade-offs. Topics covered included distributed systems, database design, and performance optimization strategies. The interview demonstrated systematic thinking and experience with large-scale system architecture.`
    }

    if (summaries[interviewType as keyof typeof summaries]) {
      return summaries[interviewType as keyof typeof summaries]
    }

    return `Completed a ${interviewLength} minute ${interviewType.toLowerCase()} interview for the ${role} position at ${company}. The session provided valuable insights into qualifications, experience, and potential fit for the role. The interview covered relevant topics and demonstrated key competencies required for success in the position.`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Create floating particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }}
    />
  ))

  if (conversationSummary) {
    return (
      <div className="min-h-screen bg-professional text-white overflow-hidden relative flex items-center justify-center">
        {/* Animated Background Particles */}
        <div className="particles">
          {particles}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto p-8">
          <div className="glass-strong rounded-2xl p-8 border border-slate-700/30 text-center card-3d animate-scale-in">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow ${
              interviewScore && interviewScore >= 80 ? 'bg-gradient-to-r from-green-500 to-teal-600' :
              interviewScore && interviewScore >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
              interviewScore ? 'bg-gradient-to-r from-orange-500 to-red-600' :
              'bg-gradient-to-r from-green-500 to-teal-600'
            }`}>
              <Save className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-serif mb-4 text-gradient">Interview Session Saved!</h2>
            
            {interviewScore && (
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">
                  <span className={`${
                    interviewScore >= 80 ? 'text-green-400' :
                    interviewScore >= 70 ? 'text-amber-400' :
                    'text-orange-400'
                  }`}>
                    {interviewScore}%
                  </span>
                </div>
                <p className="text-slate-400">Interview Performance Score</p>
              </div>
            )}
            
            <p className="text-slate-300 mb-6">Your {interviewType.toLowerCase()} interview for {role} at {company} has been saved to your history.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="glass rounded-lg p-4 text-left">
                <h3 className="font-semibold text-amber-400 mb-3">Summary</h3>
                <p className="text-sm text-slate-200">{conversationSummary}</p>
              </div>
              
              {interviewAnalysis && (
                <div className="glass rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-amber-400 mb-3">Key Insights</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Communication:</span>
                      <span className="text-white">{interviewAnalysis.detailedAnalysis.communication}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Technical:</span>
                      <span className="text-white">{interviewAnalysis.detailedAnalysis.technicalKnowledge}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Problem Solving:</span>
                      <span className="text-white">{interviewAnalysis.detailedAnalysis.problemSolving}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cultural Fit:</span>
                      <span className="text-white">{interviewAnalysis.detailedAnalysis.culturalFit}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {interviewAnalysis && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="glass rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-green-400 mb-3">Strengths</h3>
                  <ul className="text-sm text-slate-200 space-y-1">
                    {interviewAnalysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="glass rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-amber-400 mb-3">Areas for Improvement</h3>
                  <ul className="text-sm text-slate-200 space-y-1">
                    {interviewAnalysis.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <p className="text-slate-400">Returning to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-professional text-white overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="particles">
        {particles}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass border-b border-slate-700/30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between animate-fade-in">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors interactive"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>

              <div className="flex items-center space-x-6">
                {state.isConnected && (
                  <div className="glass px-3 py-2 rounded-lg border border-slate-700/30 status-indicator">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-mono">{formatDuration(state.sessionDuration)}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-right">
                  <h1 className="text-lg font-semibold text-gradient">{role} at {company}</h1>
                  <p className="text-sm text-slate-400">{interviewType} Interview</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {!state.isConnected ? (
              // Pre-interview Setup
              <div className="text-center">
                <div className="glass-strong rounded-2xl p-8 border border-slate-700/30 mb-8 card-3d animate-scale-in">
                  <h2 className="text-3xl font-bold font-serif mb-4 text-gradient">
                    Ready for your {interviewType.toLowerCase()} interview?
                  </h2>
                  <p className="text-xl text-slate-300 mb-6">
                    Interviewing for <span className="text-amber-400 neon-glow">{role}</span> at <span className="text-amber-400 neon-glow">{company}</span>
                  </p>
                  
                  <div className="glass rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold mb-4 text-amber-400">Interview Details:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-400">Type:</span> {interviewType}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-400">Duration:</span> {duration} minutes
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-600/50">
                      <h4 className="font-medium text-amber-400 mb-2">What to Expect:</h4>
                      <p className="text-sm text-slate-400">
                        {interviewType === 'Technical' && 'Coding challenges, algorithmic thinking, and technical problem-solving.'}
                        {interviewType === 'Behavioral' && 'Past experiences, situational questions, and cultural fit assessment.'}
                        {interviewType === 'System Design' && 'Architecture discussions, scalability considerations, and design trade-offs.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartInterview}
                    disabled={!role || !company || !interviewType}
                    className="btn-primary text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto shadow-elevated"
                  >
                    <Play className="h-5 w-5" />
                    <span>Begin Interview</span>
                  </button>

                  {state.error && (
                    <div className="mt-6 glass rounded-lg p-4 border border-red-500/20">
                      <div className="flex items-center space-x-2 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{state.error}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar Preview */}
                <div className="glass rounded-2xl p-8 border border-slate-700/30 animate-fade-in stagger-1">
                  <div className="avatar-container">
                    <div className="w-48 h-48 bg-gradient-to-r from-amber-500/20 to-slate-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-400/30 avatar-frame float">
                      <span className="text-6xl">👔</span>
                    </div>
                  </div>
                  <p className="text-slate-400">AI Interviewer will appear here during the session</p>
                </div>
              </div>
            ) : (
              // Active Interview
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Video/Avatar Section */}
                <div className="lg:col-span-3">
                  <div className="glass-strong rounded-2xl p-6 border border-slate-700/30 h-96 flex items-center justify-center card-3d">
                    <AvatarDisplay
                      avatarUrl={state.avatarUrl}
                      isVideoEnabled={state.isVideoEnabled}
                      agentConnected={state.agentConnected}
                      figureName="AI Interviewer"
                    />
                  </div>
                </div>

                {/* Controls Section */}
                <div className="space-y-6">
                  <div className="glass-strong rounded-xl p-6 border border-slate-700/30 card-3d">
                    <h3 className="font-semibold mb-4 text-amber-400">Interview Controls</h3>
                    
                    <div className="space-y-4">
                      <button
                        onClick={handleToggleRecording}
                        disabled={!state.agentConnected}
                        className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed interactive ${
                          state.isRecording
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        }`}
                      >
                        {state.isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        <span>{state.isRecording ? 'Pause' : 'Resume'}</span>
                      </button>

                      <button
                        onClick={handleToggleVideo}
                        className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium glass hover:bg-slate-600/50 text-white transition-colors interactive"
                      >
                        {state.isVideoEnabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                        <span>{state.isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}</span>
                      </button>

                      <button
                        onClick={handleEndInterview}
                        disabled={isEnding}
                        className="btn-primary w-full py-3 rounded-lg font-medium text-slate-900 disabled:opacity-50 interactive"
                      >
                        {isEnding ? 'Ending...' : 'End Interview'}
                      </button>
                    </div>
                  </div>

                  <div className="glass-strong rounded-xl p-6 border border-slate-700/30 card-3d">
                    <h3 className="font-semibold mb-4 text-amber-400">Session Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Duration:</span>
                        <span className="font-mono text-white">{formatDuration(state.sessionDuration)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${state.isRecording ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {state.isRecording ? 'Recording' : 'Paused'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Agent:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${state.agentConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {state.agentConnected ? 'Connected' : 'Connecting...'}
                        </span>
                      </div>
                    </div>

                    {state.error && (
                      <div className="mt-4 glass rounded-lg p-3 border border-red-500/20">
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs">{state.error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Instructions for user */}
                  <div className="glass rounded-xl p-4 border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">How to use:</h4>
                    <ul className="text-xs text-blue-300 space-y-1">
                      <li>• Click the avatar to interact</li>
                      <li>• Use your microphone to speak</li>
                      <li>• Session will be automatically saved</li>
                      <li>• Click "End Interview" when finished</li>
                    </ul>
                  </div>

                  {/* Interview Log */}
                  {conversationMessages.length > 0 && (
                    <div className="glass-strong rounded-xl p-4 border border-slate-700/30 max-h-48 overflow-y-auto">
                      <h4 className="font-medium text-slate-300 mb-3">Interview Log</h4>
                      <div className="space-y-2">
                        {conversationMessages.slice(-5).map((message, index) => (
                          <div key={index} className="text-xs">
                            <span className={`font-medium ${message.speaker === 'user' ? 'text-blue-400' : 'text-amber-400'}`}>
                              {message.speaker === 'user' ? 'You' : 'Interviewer'}:
                            </span>
                            <span className="text-slate-300 ml-2">{message.content}</span>
                          </div>
                        ))}
                      </div>
                      {conversationMessages.length > 5 && (
                        <p className="text-xs text-slate-500 mt-2">Showing last 5 messages...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}