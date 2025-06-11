import React, { useState, useEffect } from 'react'
import { Clock, LogOut, MessageCircle, Trash2, Calendar, User, BookOpen, Briefcase, Play, TrendingUp, Target, Award, Edit3, Check, X, BarChart3, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase, InterviewSession, UserSettings } from '../lib/supabase'

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
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([])
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [editingTargetScore, setEditingTargetScore] = useState(false)
  const [tempTargetScore, setTempTargetScore] = useState(85)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadInterviewSessions()
      loadUserSettings()
    }
  }, [user])

  const loadInterviewSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInterviewSessions(data || [])
    } catch (error) {
      console.error('Error loading interview sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserSettings = async () => {
    try {
      let { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }
      
      if (data) {
        setUserSettings(data)
        setTempTargetScore(data.target_score)
      } else {
        // Create default settings if none exist using upsert
        const { data: newData, error: upsertError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user?.id,
            target_score: 85
          }, { onConflict: 'user_id' })
          .select()
          .single()

        if (upsertError) {
          console.error('Error creating user settings:', upsertError)
        } else {
          setUserSettings(newData)
          setTempTargetScore(85)
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  const updateTargetScore = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update({ target_score: tempTargetScore })
        .eq('user_id', user?.id)
        .select()
        .single()

      if (error) throw error
      setUserSettings(data)
      setEditingTargetScore(false)
    } catch (error) {
      console.error('Error updating target score:', error)
    }
  }

  const cancelEditTargetScore = () => {
    setTempTargetScore(userSettings?.target_score || 85)
    setEditingTargetScore(false)
  }

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interview_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error
      setInterviewSessions(sessions => sessions.filter(session => session.id !== id))
    } catch (error) {
      console.error('Error deleting session:', error)
    }
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
  const avgDuration = totalInterviews > 0 ? Math.round(interviewSessions.reduce((acc, session) => acc + session.duration, 0) / totalInterviews) : 0
  const interviewTypes = new Set(interviewSessions.map(s => s.interview_type)).size
  
  // Mock score calculation (in real app, this would come from AI evaluation)
  const generateMockScore = (session: InterviewSession): number => {
    // Generate consistent mock scores based on session data
    const hash = session.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return Math.abs(hash % 30) + 70 // Scores between 70-100
  }
  
  const sessionsWithScores = interviewSessions.map(session => ({
    ...session,
    score: session.score || generateMockScore(session)
  }))
  
  const avgScore = totalInterviews > 0 ? Math.round(sessionsWithScores.reduce((acc, session) => acc + session.score, 0) / totalInterviews) : 0
  const targetScore = userSettings?.target_score || 85
  const scoreProgress = avgScore / targetScore * 100
  
  // Recent performance trend (last 5 interviews)
  const recentSessions = sessionsWithScores.slice(0, 5)
  const recentAvgScore = recentSessions.length > 0 ? Math.round(recentSessions.reduce((acc, session) => acc + session.score, 0) / recentSessions.length) : 0
  const isImproving = recentAvgScore > avgScore
  
  // Best performance
  const bestScore = totalInterviews > 0 ? Math.max(...sessionsWithScores.map(s => s.score)) : 0
  
  // Interview frequency (interviews this month)
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const interviewsThisMonth = interviewSessions.filter(session => 
    new Date(session.created_at) >= thisMonth
  ).length
  // Create floating particles
  const particles = Array.from({ length: 30 }, (_, i) => (
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
              <div className="flex items-center space-x-2 float">
                <div className="relative">
                  <Briefcase className="h-8 w-8 text-amber-400 pulse-glow" />
                  <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
                </div>
                <span className="text-xl font-bold font-serif neon-glow">AI Interview Prep</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="glass px-4 py-2 rounded-lg border border-slate-700/30 interactive">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-amber-400" />
                    <span className="text-sm">{user?.user_metadata?.full_name || user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors interactive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-gradient float">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Job Seeker'}!
            </h1>
            <p className="text-xl text-slate-300">
              Ready to ace your next interview with AI practice?
            </p>
          </div>

          {/* Comprehensive Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-1">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalInterviews}</div>
                  <div className="text-slate-400 text-sm">Total Interviews</div>
                </div>
              </div>
            </div>
            
            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{avgScore}%</div>
                  <div className="text-slate-400 text-sm">Average Score</div>
                </div>
              </div>
            </div>
            
            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    {editingTargetScore ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={tempTargetScore}
                          onChange={(e) => setTempTargetScore(parseInt(e.target.value) || 85)}
                          className="w-16 text-lg font-bold bg-transparent text-white border-b border-amber-400 focus:outline-none"
                          min="1"
                          max="100"
                        />
                        <span className="text-lg font-bold text-white">%</span>
                        <button
                          onClick={updateTargetScore}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditTargetScore}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">{targetScore}%</span>
                        <button
                          onClick={() => setEditingTargetScore(true)}
                          className="text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-slate-400 text-sm">Target Score</div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{bestScore}%</div>
                  <div className="text-slate-400 text-sm">Best Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-1">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{avgDuration}m</div>
                  <div className="text-slate-400 text-sm">Avg Duration</div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-2">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${isImproving ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-red-600'} rounded-lg flex items-center justify-center`}>
                  <TrendingUp className={`h-6 w-6 text-white ${isImproving ? '' : 'rotate-180'}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{recentAvgScore}%</div>
                  <div className="text-slate-400 text-sm">Recent Avg</div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{interviewTypes}</div>
                  <div className="text-slate-400 text-sm">Interview Types</div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-6 card-3d interactive animate-fade-in stagger-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{interviewsThisMonth}</div>
                  <div className="text-slate-400 text-sm">This Month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {totalInterviews > 0 && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="glass-strong rounded-xl p-6 border border-slate-700/30 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-amber-400">Progress to Target</h3>
                  <span className="text-sm text-slate-400">{Math.min(scoreProgress, 100).toFixed(1)}% of target achieved</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      scoreProgress >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      scoreProgress >= 80 ? 'bg-gradient-to-r from-amber-500 to-yellow-600' :
                      'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                    style={{ width: `${Math.min(scoreProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Current: {avgScore}%</span>
                  <span>Target: {targetScore}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Interview Setup */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="glass-strong rounded-2xl p-8 border border-slate-700/30 card-3d animate-scale-in">
              <h2 className="text-2xl font-semibold mb-6 font-serif text-center text-gradient">Start a New Interview Practice</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="animate-fade-in stagger-1">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Role You're Applying For
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none interactive"
                  />
                </div>

                <div className="animate-fade-in stagger-2">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                    className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none interactive"
                  />
                </div>

                <div className="animate-fade-in stagger-3">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Interview Type
                  </label>
                  <select
                    value={formData.interviewType}
                    onChange={(e) => handleInputChange('interviewType', e.target.value)}
                    className="form-input w-full rounded-lg px-4 py-3 text-white focus:outline-none interactive"
                  >
                    <option value="">Select interview type...</option>
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                <div className="animate-fade-in stagger-4">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Interview Duration (minutes)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="form-input w-full rounded-lg px-4 py-3 text-white focus:outline-none interactive"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="animate-fade-in stagger-1">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Your Resume (paste as text)
                  </label>
                  <textarea
                    value={formData.resume}
                    onChange={(e) => handleInputChange('resume', e.target.value)}
                    placeholder="Paste your resume content here..."
                    rows={8}
                    className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none interactive"
                  />
                </div>

                <div className="animate-fade-in stagger-2">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Job Description (paste as text)
                  </label>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={8}
                    className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none interactive"
                  />
                </div>
              </div>

              <div className="mb-8 animate-fade-in stagger-3">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information you'd like the interviewer to know about you..."
                  rows={3}
                  className="form-input w-full rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none resize-none interactive"
                />
              </div>

              <button
                onClick={startInterview}
                disabled={!isFormValid}
                className="btn-primary w-full text-slate-900 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-elevated"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Start Interview Practice</span>
              </button>
            </div>
          </div>

          {/* Interview History */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-serif mb-8 text-center text-gradient">Your Interview History</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner-3d mx-auto mb-4"></div>
                <p className="text-slate-300">Loading your interview history...</p>
              </div>
            ) : interviewSessions.length === 0 ? (
              <div className="text-center py-12 glass-strong rounded-2xl border border-slate-700/30 animate-fade-in">
                <BookOpen className="h-16 w-16 text-slate-500 mx-auto mb-4 float" />
                <h3 className="text-xl font-semibold mb-2">No interview sessions yet</h3>
                <p className="text-slate-400">Start your first interview practice to begin building your skills!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {sessionsWithScores.map((session, index) => {
                  const IconComponent = getInterviewTypeIcon(session.interview_type)
                  const gradientClass = getInterviewTypeColor(session.interview_type)
                  const scoreColor = session.score >= 90 ? 'text-green-400' : 
                                   session.score >= 80 ? 'text-amber-400' : 
                                   session.score >= 70 ? 'text-orange-400' : 'text-red-400'
                  
                  return (
                    <div
                      key={session.id}
                      className={`glass-strong rounded-xl p-6 border border-slate-700/30 card-3d group animate-fade-in stagger-${(index % 4) + 1}`}
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
                        
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200 p-2 hover:bg-slate-700/50 rounded-lg interactive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="text-slate-200 leading-relaxed">{session.summary}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}