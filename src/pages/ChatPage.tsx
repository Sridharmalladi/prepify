import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Clock, Save, AlertCircle, Briefcase, Play, Pause, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function ChatPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Extract parameters
  const isDemo = searchParams.get('demo') === 'true'
  const role = searchParams.get('role') || ''
  const company = searchParams.get('company') || ''
  const interviewType = searchParams.get('interviewType') as 'Technical' | 'Behavioral' | 'System Design' || 'Technical'
  const duration = parseInt(searchParams.get('duration') || '30')
  const experienceLevel = searchParams.get('experienceLevel') || 'Mid'

  // Interview state
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [agentConnected, setAgentConnected] = useState(false)
  const [conversationSummary, setConversationSummary] = useState('')
  const [messages, setMessages] = useState<Array<{speaker: 'user' | 'agent', content: string, timestamp: number}>>([])

  // Mock interview flow
  useEffect(() => {
    if (!isConnected) return

    // Simulate agent connection
    const connectTimer = setTimeout(() => {
      setAgentConnected(true)
      setIsRecording(true)
      
      // Add initial greeting
      const greeting = getInitialGreeting()
      setMessages([{
        speaker: 'agent',
        content: greeting,
        timestamp: Date.now()
      }])
    }, 2000)

    return () => clearTimeout(connectTimer)
  }, [isConnected])

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected && isRecording) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected, isRecording])

  const getInitialGreeting = () => {
    const greetings = {
      'Technical': `Hello! I'm your interviewer from ${company}. I'll be conducting your technical interview for the ${role} position today. I've reviewed your background and our job requirements. Let's start with a coding problem relevant to the work you'd be doing in this role.`,
      'Behavioral': `Hello! I'm your interviewer from ${company}. I'll be conducting your behavioral interview for the ${role} position today. I've reviewed your resume and our role requirements. Let's begin - tell me about a challenging project you've worked on that demonstrates skills relevant to this position.`,
      'System Design': `Hello! I'm your interviewer from ${company}. I'll be conducting your system design interview for the ${role} position today. I've reviewed your experience and our technical requirements. Let's start with designing a system that would be relevant to the challenges we face at ${company}.`
    }
    
    return greetings[interviewType] || greetings['Technical']
  }

  const handleStartInterview = () => {
    setIsConnected(true)
  }

  const handleEndInterview = () => {
    // Generate mock summary
    const mockSummary = `Completed a ${Math.floor(sessionDuration / 60)} minute ${interviewType.toLowerCase()} interview for the ${role} position at ${company}. ${isDemo ? 'This was a demo session showcasing our AI interviewer capabilities.' : 'The session provided valuable insights into qualifications and readiness for the role.'}`
    
    setConversationSummary(mockSummary)
    
    // Navigate back after showing summary
    setTimeout(() => {
      navigate(isDemo ? '/' : '/dashboard')
    }, 3000)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Show summary screen
  if (conversationSummary) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-professional text-white flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="glass-strong rounded-2xl p-8 max-w-2xl w-full border border-slate-700/30 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-r from-green-500 to-teal-600"
          >
            <Save className="h-8 w-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold font-serif mb-4 text-gradient">
            {isDemo ? 'Demo Complete!' : 'Interview Session Saved!'}
          </h2>
          
          <p className="text-slate-300 mb-6">{conversationSummary}</p>
          
          {isDemo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-lg p-4 mb-6 border border-blue-500/20"
            >
              <h3 className="font-semibold text-blue-400 mb-2">Ready for the full experience?</h3>
              <p className="text-sm text-blue-300">
                Sign up to save your sessions, track progress, and access advanced features!
              </p>
            </motion.div>
          )}
          
          <p className="text-slate-400">
            Returning to {isDemo ? 'home' : 'dashboard'}...
          </p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-professional text-white"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-b border-slate-700/30"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isDemo ? '/' : '/dashboard')}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to {isDemo ? 'Home' : 'Dashboard'}</span>
            </motion.button>

            <div className="flex items-center space-x-6">
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass px-3 py-2 rounded-lg border border-slate-700/30"
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-mono">{formatDuration(sessionDuration)}</span>
                  </div>
                </motion.div>
              )}
              
              <div className="text-right">
                <h1 className="text-lg font-semibold text-gradient">{role} at {company}</h1>
                <p className="text-sm text-slate-400">
                  {interviewType} Interview {isDemo && '(Demo)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {!isConnected ? (
            // Pre-interview Setup
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <div className="glass-strong rounded-2xl p-8 border border-slate-700/30 mb-8">
                <h2 className="text-3xl font-bold font-serif mb-4 text-gradient">
                  Ready for your {interviewType.toLowerCase()} interview?
                </h2>
                <p className="text-xl text-slate-300 mb-6">
                  Interviewing for <span className="text-amber-400">{role}</span> at <span className="text-amber-400">{company}</span>
                </p>
                
                {isDemo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-lg p-4 mb-6 border border-blue-500/20"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Play className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-blue-400">Demo Mode</span>
                    </div>
                    <p className="text-sm text-blue-300">
                      This is a demonstration of our AI interviewer. Experience the full interview flow!
                    </p>
                  </motion.div>
                )}
                
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
                    {experienceLevel && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-400">Level:</span> {experienceLevel}
                      </div>
                    )}
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

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartInterview}
                  className="btn-primary text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 mx-auto shadow-elevated"
                >
                  <Play className="h-5 w-5" />
                  <span>Begin Interview</span>
                </motion.button>
              </div>

              {/* Avatar Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-8 border border-slate-700/30"
              >
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-48 h-48 bg-gradient-to-r from-amber-500/20 to-slate-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-400/30"
                >
                  <span className="text-6xl">👔</span>
                </motion.div>
                <p className="text-slate-400">AI Interviewer will appear here during the session</p>
              </motion.div>
            </motion.div>
          ) : (
            // Active Interview
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Video/Avatar Section */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-strong rounded-2xl p-6 border border-slate-700/30 h-96 flex items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    {!agentConnected ? (
                      <motion.div
                        key="connecting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <div className="w-32 h-32 bg-gradient-to-r from-amber-500/20 to-slate-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-400/30">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"
                          />
                        </div>
                        <p className="text-slate-300 mb-2">Connecting to interviewer...</p>
                        <p className="text-sm text-slate-400">Please wait while we prepare your interview session</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="connected"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center w-full h-full flex items-center justify-center"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border-2 border-amber-400/30">
                          <div className="text-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-32 h-32 bg-gradient-to-r from-amber-500/30 to-slate-500/30 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-400/50"
                            >
                              <span className="text-6xl">👔</span>
                            </div>
                            <p className="text-slate-300 mb-2">AI Interviewer is ready</p>
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-400">Connected</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Controls Section */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-strong rounded-xl p-6 border border-slate-700/30"
                >
                  <h3 className="font-semibold mb-4 text-amber-400">Interview Controls</h3>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRecording(!isRecording)}
                      disabled={!agentConnected}
                      className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRecording
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      }`}
                    >
                      {isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      <span>{isRecording ? 'Pause' : 'Resume'}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                      className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium glass hover:bg-slate-600/50 text-white transition-colors"
                    >
                      {isVideoEnabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                      <span>{isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEndInterview}
                      className="btn-primary w-full py-3 rounded-lg font-medium text-slate-900"
                    >
                      End Interview
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-strong rounded-xl p-6 border border-slate-700/30"
                >
                  <h3 className="font-semibold mb-4 text-amber-400">Session Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-mono text-white">{formatDuration(sessionDuration)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${isRecording ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isRecording ? 'Recording' : 'Paused'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Agent:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${agentConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {agentConnected ? 'Connected' : 'Connecting...'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-xl p-4 border border-blue-500/20"
                >
                  <h4 className="font-medium text-blue-400 mb-2">How to use:</h4>
                  <ul className="text-xs text-blue-300 space-y-1">
                    <li>• Speak naturally to the AI interviewer</li>
                    <li>• Use the controls to pause/resume</li>
                    <li>• Session will be automatically saved</li>
                    <li>• Click "End Interview" when finished</li>
                  </ul>
                </motion.div>

                {/* Messages */}
                {messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-strong rounded-xl p-4 border border-slate-700/30 max-h-48 overflow-y-auto"
                  >
                    <h4 className="font-medium text-slate-300 mb-3 flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Interview Log</span>
                    </h4>
                    <div className="space-y-2">
                      {messages.slice(-3).map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs"
                        >
                          <span className={`font-medium ${message.speaker === 'user' ? 'text-blue-400' : 'text-amber-400'}`}>
                            {message.speaker === 'user' ? 'You' : 'Interviewer'}:
                          </span>
                          <span className="text-slate-300 ml-2">{message.content}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  )
}