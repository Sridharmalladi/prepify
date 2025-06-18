import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, LogOut, MessageCircle, Trash2, Calendar, User, BookOpen, Briefcase, Play, TrendingUp, Target, Award, Edit3, Check, X, BarChart3, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Mock data for demonstration
const mockInterviewSessions = [
  {
    id: '1',
    role: 'Senior Software Engineer',
    company: 'Google',
    interview_type: 'Technical' as const,
    duration: 45,
    summary: 'Completed a comprehensive technical interview focusing on algorithms and system design. Demonstrated strong problem-solving skills and technical communication.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    score: 87
  },
  {
    id: '2',
    role: 'Product Manager',
    company: 'Microsoft',
    interview_type: 'Behavioral' as const,
    duration: 30,
    summary: 'Behavioral interview covering leadership scenarios and past experiences. Showed excellent communication and strategic thinking abilities.',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    score: 92
  },
  {
    id: '3',
    role: 'Full Stack Developer',
    company: 'Startup Inc',
    interview_type: 'System Design' as const,
    duration: 60,
    summary: 'System design interview focusing on scalable architecture. Discussed microservices, database design, and performance optimization strategies.',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    score: 78
  }
]

export function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    interviewType: '' as 'Technical' | 'Behavioral' | 'System Design' | '',
    duration: 30,
    resume: '',
    jobDescription: '',
    additionalNotes: ''
  })
  const [interviewSessions, setInterviewSessions] = useState(mockInterviewSessions)
  const [targetScore, setTargetScore] = useState(85)
  const [editingTargetScore, setEditingTargetScore] = useState(false)
  const [tempTargetScore, setTempTargetScore] = useState(85)

  const deleteSession = (id: string) => {
    setInterviewSessions(sessions => sessions.filter(session => session.id !== id))
  }

  const startInterview = () => {
    if (formData.role && formData.company && formData.interviewType && formData.resume && formData.jobDescription) {
      const params = new URLSearchParams({
        role: formData.role,
        company: formData.company,
        interviewType: formData.interviewType,
        duration: formData.duration.toString(),
        resume: formData.resume,
        jobDescription: formData.jobDescription,
        additionalNotes: formData.additionalNotes
      })
      navigate(`/chat?${params.toString()}`)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.role && formData.company && formData.interviewType && formData.resume && formData.jobDescription

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'Technical': return Target
      case 'Behavioral': return User
      case 'System Design': return TrendingUp
      default: return Award
    }
  }

  const getInterviewTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'from-blue-500 to-purple-600'
      case 'Behavioral': return 'from-green-500 to-teal-600'
      case 'System Design': return 'from-orange-500 to-red-600'
      default: return 'from-amber-500 to-yellow-600'
    }
  }

  // Calculate metrics
  const totalInterviews = interviewSessions.length
  const avgScore = totalInterviews > 0 ? Math.round(interviewSessions.reduce((acc, session) => acc + session.score, 0) / totalInterviews) : 0
  const bestScore = totalInterviews > 0 ? Math.max(...interviewSessions.map(s => s.score)) : 0
  const avgDuration = totalInterviews > 0 ? Math.round(interviewSessions.reduce((acc, session) => acc + session.duration, 0) / totalInterviews) : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-professional text-white"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass border-b border-slate-700/30"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Briefcase className="h-8 w-8 text-amber-400" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-20"
                />
              </div>
              <span className="text-xl font-bold font-serif text-gradient">AI Interview Prep</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <div className="glass px-4 py-2 rounded-lg border border-slate-700/30">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">{user?.user_metadata?.full_name || user?.email}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-gradient">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Job Seeker'}!
          </h1>
          <p className="text-xl text-slate-300">
            Ready to ace your next interview with AI practice?
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: Play, value: totalInterviews, label: 'Total Interviews', gradient: 'from-blue-500 to-purple-600' },
            { icon: BarChart3, value: `${avgScore}%`, label: 'Average Score', gradient: 'from-amber-500 to-orange-600' },
            { icon: Trophy, value: `${bestScore}%`, label: 'Best Score', gradient: 'from-green-500 to-teal-600' },
            { icon: Clock, value: `${avgDuration}m`, label: 'Avg Duration', gradient: 'from-purple-500 to-pink-600' }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <motion.div
                key={metric.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-strong rounded-xl p-6 border border-slate-700/30 hover:border-amber-400/30 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.gradient} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-slate-400 text-sm">{metric.label}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Interview Setup */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="glass-strong rounded-2xl p-8 border border-slate-700/30">
            <h2 className="text-2xl font-semibold mb-6 font-serif text-center text-gradient">
              Start a New Interview Practice
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Role You're Applying For
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                  className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Interview Type
                </label>
                <select
                  value={formData.interviewType}
                  onChange={(e) => handleInputChange('interviewType', e.target.value)}
                  className="form-input w-full rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
                >
                  <option value="">Select interview type...</option>
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="System Design">System Design</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Interview Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="form-input w-full rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Your Resume (paste as text)
                </label>
                <textarea
                  value={formData.resume}
                  onChange={(e) => handleInputChange('resume', e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={8}
                  className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Job Description (paste as text)
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none transition-all duration-300"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Additional Notes (optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any additional information you'd like the interviewer to know about you..."
                rows={3}
                className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none transition-all duration-300"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={startInterview}
              disabled={!isFormValid}
              className="btn-primary w-full text-slate-900 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-elevated"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Start Interview Practice</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Interview History */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold font-serif mb-8 text-center text-gradient">
            Your Interview History
          </h2>
          
          {interviewSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12 glass-strong rounded-2xl border border-slate-700/30"
            >
              <BookOpen className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No interview sessions yet</h3>
              <p className="text-slate-400">Start your first interview practice to begin building your skills!</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              <AnimatePresence>
                {interviewSessions.map((session, index) => {
                  const IconComponent = getInterviewTypeIcon(session.interview_type)
                  const gradientClass = getInterviewTypeColor(session.interview_type)
                  const scoreColor = session.score >= 90 ? 'text-green-400' : 
                                   session.score >= 80 ? 'text-amber-400' : 
                                   session.score >= 70 ? 'text-orange-400' : 'text-red-400'
                  
                  return (
                    <motion.div
                      key={session.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -5 }}
                      layout
                      className="glass-strong rounded-xl p-6 border border-slate-700/30 hover:border-amber-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-r ${gradientClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-amber-400">{session.role}</h3>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-300 text-sm">{session.company}</span>
                              <span className="text-slate-500">•</span>
                              <span className={`text-sm px-2 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white`}>
                                {session.interview_type}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className={`text-sm font-semibold ${scoreColor}`}>
                                {session.score}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(session.created_at)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{session.duration} minutes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteSession(session.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200 p-2 hover:bg-slate-700/50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                      
                      <p className="text-slate-200 leading-relaxed">{session.summary}</p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>
    </motion.div>
  )
}