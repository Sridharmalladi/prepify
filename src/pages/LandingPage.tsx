import React from 'react'
import { useState } from 'react'
import { Briefcase, Sparkles, Users, BookOpen, ArrowRight, Target, Brain, TrendingUp, Zap, Award, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { AuthModal } from '../components/AuthModal'

export function LandingPage() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const interviewTypes = [
    { name: 'Technical Interviews', description: 'Coding challenges & algorithms', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg', icon: Brain },
    { name: 'Behavioral Interviews', description: 'Past experiences & soft skills', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', icon: Users },
    { name: 'System Design', description: 'Architecture & scalability', image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg', icon: Target },
    { name: 'Mock Interviews', description: 'Realistic practice sessions', image: 'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg', icon: Award },
  ]

  const additionalTypes = [
    { name: 'FAANG Prep', description: 'Big tech company focus', image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg', icon: Zap },
    { name: 'Startup Interviews', description: 'Fast-paced environment prep', image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', icon: TrendingUp },
    { name: 'Leadership Roles', description: 'Management & strategy', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg', icon: Target },
    { name: 'Career Transitions', description: 'Switching industries', image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg', icon: CheckCircle },
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Interviews',
      description: 'Practice with our advanced AI interviewer that adapts to your responses and provides realistic interview scenarios.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Targeted Practice',
      description: 'Focus on specific interview types - technical coding, behavioral questions, or system design challenges.',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your interview performance over time and identify areas for improvement with detailed session summaries.',
      gradient: 'from-green-500 to-teal-600'
    }
  ]

  // Create floating particles with better performance
  const particles = Array.from({ length: 40 }, (_, i) => (
    <div
      key={i}
      className="particle hardware-accelerated"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-professional text-white overflow-hidden relative page-transition">
      {/* Animated Background Particles */}
      <div className="particles hardware-accelerated">
        {particles}
      </div>

      {/* Hero & Previews */}
      <div className="relative z-10">
        <header className="container mx-auto px-6 pt-8">
          <nav className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2 float">
              <div className="relative">
                <Briefcase className="h-8 w-8 text-amber-400 pulse-glow" />
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
              </div>
              <span className="text-xl font-bold font-serif neon-glow">AI Interview Prep</span>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              disabled={loading}
              className="btn-primary text-slate-900 px-6 py-2 rounded-lg font-medium disabled:opacity-50 interactive magnetic ripple"
            >
              {loading ? (
                <div className="spinner-3d mx-auto"></div>
              ) : (
                'Get Started'
              )}
            </button>
          </nav>
        </header>

        <main className="container mx-auto px-6 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold font-serif mb-6 text-gradient leading-tight animate-scale-in hardware-accelerated">
              Ace Your Next
              <br />
              Interview with AI.
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in stagger-1">
              Practice technical, behavioral, and system design interviews with our AI interviewer.
              Get personalized feedback, build confidence, and land your dream job with realistic interview simulations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up stagger-2">
              <button
                onClick={() => setShowAuthModal(true)}
                disabled={loading}
                className="group btn-primary text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 shadow-elevated disabled:opacity-50 interactive magnetic ripple"
              >
                <span>Start Practicing</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <div className="flex items-center space-x-2 text-slate-400 glass px-4 py-2 rounded-lg hover-lift">
                <Users className="h-5 w-5" />
                <span>Join thousands of job seekers</span>
              </div>
            </div>

            {/* Interview Types Preview with enhanced animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {interviewTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <div
                    key={type.name}
                    className={`card-3d glass-strong rounded-xl overflow-hidden interactive hover-lift animate-fade-in stagger-${index + 1} hardware-accelerated group`}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={type.image}
                        alt={type.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <div className="glass p-2 rounded-lg pulse-glow">
                          <IconComponent className="h-5 w-5 text-amber-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">{type.name}</h3>
                      <p className="text-sm text-slate-300">{type.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Additional Types with staggered animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {additionalTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <div
                    key={type.name}
                    className={`card-3d glass-strong rounded-xl overflow-hidden interactive hover-lift animate-fade-in stagger-${index + 5} hardware-accelerated group`}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={type.image}
                        alt={type.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <div className="glass p-2 rounded-lg pulse-glow">
                          <IconComponent className="h-5 w-5 text-amber-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">{type.name}</h3>
                      <p className="text-sm text-slate-300">{type.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>

        {/* Features Section with enhanced animations */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4 text-gradient animate-fade-in">Why Choose AI Interview Prep?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in stagger-1">
              Experience the future of interview preparation with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={feature.title} className={`text-center group animate-fade-in stagger-${index + 2} hardware-accelerated`}>
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 card-3d shadow-elevated float-delayed pulse-glow`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 font-serif group-hover:text-amber-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats Section with counter animations */}
        <section className="container mx-auto px-6 py-16">
          <div className="glass-strong rounded-3xl p-8 md:p-12 hover-lift">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in stagger-1 group">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="text-slate-300">Interviews Completed</div>
              </div>
              <div className="animate-fade-in stagger-2 group">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
                <div className="text-slate-300">Success Rate</div>
              </div>
              <div className="animate-fade-in stagger-3 group">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-slate-300">Companies Covered</div>
              </div>
              <div className="animate-fade-in stagger-4 group">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-slate-300">AI Availability</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with enhanced interactivity */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center glass-strong rounded-3xl p-12 card-3d hover-lift">
            <h2 className="text-4xl font-bold font-serif mb-6 text-gradient animate-fade-in">Ready to Land Your Dream Job?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in stagger-1">
              Join thousands of successful candidates who've used AI Interview Prep to ace their interviews
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              disabled={loading}
              className="btn-primary text-slate-900 px-10 py-4 rounded-xl font-semibold text-xl shadow-elevated interactive magnetic ripple animate-fade-in stagger-2"
            >
              Start Your Journey Today
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-slate-700/30">
          <div className="text-center text-slate-400 animate-fade-in">
            <p>Built with Bolt.new • Powered by AI, Tavus, LiveKit, and Supabase</p>
          </div>
        </footer>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}