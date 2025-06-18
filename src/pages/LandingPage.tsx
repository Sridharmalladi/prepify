import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, ArrowRight, Users, Play, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthModal } from '../components/AuthModal'
import { DemoModal, DemoConfig } from '../components/DemoModal'
import { FeatureShowcase } from '../components/FeatureShowcase'
import { InterviewTypeCards } from '../components/InterviewTypeCards'

export function LandingPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleStartDemo = (config: DemoConfig) => {
    // Navigate to demo interview with config
    const params = new URLSearchParams({
      demo: 'true',
      role: config.jobTitle,
      company: config.company || 'Demo Company',
      interviewType: config.interviewType,
      duration: '15', // Demo is shorter
      experienceLevel: config.experienceLevel,
      resume: `Demo resume for ${config.jobTitle} with ${config.experienceLevel} level experience.`,
      jobDescription: `Demo job description for ${config.jobTitle} position.`,
      additionalNotes: 'This is a demo session to showcase our AI interviewer capabilities.'
    })
    navigate(`/chat?${params.toString()}`)
  }

  // Optimized particles for better performance
  const particles = Array.from({ length: 30 }, (_, i) => (
    <motion.div
      key={i}
      className="particle"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: Math.random() * 10 + 15,
        repeat: Infinity,
        delay: Math.random() * 20
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  ))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-professional text-white overflow-hidden relative"
    >
      {/* Animated Background Particles */}
      <div className="particles absolute inset-0 pointer-events-none">
        {particles}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 container mx-auto px-6 pt-8"
      >
        <nav className="flex items-center justify-between">
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
            <span className="text-xl font-bold font-serif text-gradient">
              AI Interview Prep
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDemoModal(true)}
              className="glass px-4 py-2 rounded-lg font-medium text-amber-400 hover:text-amber-300 transition-colors border border-amber-400/30 hover:border-amber-400/50"
            >
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Try Demo</span>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              disabled={loading}
              className="btn-primary text-slate-900 px-6 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="spinner-3d mx-auto" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </>
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20">
        <div className="text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold font-serif mb-8 text-gradient leading-tight"
          >
            Ace Your Next
            <br />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block"
            >
              Interview with AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            Practice technical, behavioral, and system design interviews with our advanced AI interviewer.
            Get personalized feedback, build confidence, and land your dream job with realistic interview simulations.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              disabled={loading}
              className="group btn-primary text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 shadow-elevated disabled:opacity-50"
            >
              <span>Start Practicing</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDemoModal(true)}
              className="glass px-6 py-4 rounded-xl font-semibold text-lg border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 flex items-center space-x-2"
            >
              <Play className="h-5 w-5 text-amber-400" />
              <span>Try Demo First</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center space-x-2 text-slate-400 glass px-4 py-2 rounded-lg"
            >
              <Users className="h-5 w-5" />
              <span>Join 10,000+ job seekers</span>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Interview Types Section */}
      <InterviewTypeCards />

      {/* Features Section */}
      <FeatureShowcase />

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-16"
      >
        <div className="glass-strong rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Interviews Completed' },
              { number: '95%', label: 'Success Rate' },
              { number: '500+', label: 'Companies Covered' },
              { number: '24/7', label: 'AI Availability' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:text-amber-400 transition-colors duration-300"
                >
                  {stat.number}
                </motion.div>
                <div className="text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-20"
      >
        <div className="text-center glass-strong rounded-3xl p-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-serif mb-6 text-gradient"
          >
            Ready to Land Your Dream Job?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of successful candidates who've used AI Interview Prep to ace their interviews
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuthModal(true)}
            disabled={loading}
            className="btn-primary text-slate-900 px-10 py-4 rounded-xl font-semibold text-xl shadow-elevated"
          >
            Start Your Journey Today
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-8 border-t border-slate-700/30"
      >
        <div className="text-center text-slate-400">
          <p>Built with Bolt.new • Powered by AI and Modern Web Technologies</p>
        </div>
      </motion.footer>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <DemoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)}
        onStartDemo={handleStartDemo}
      />
    </motion.div>
  )
}