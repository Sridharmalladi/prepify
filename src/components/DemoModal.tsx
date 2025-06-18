import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Briefcase, Code, Users, Settings, ArrowRight } from 'lucide-react'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  onStartDemo: (config: DemoConfig) => void
}

export interface DemoConfig {
  interviewType: 'Technical' | 'Behavioral' | 'System Design'
  jobTitle: string
  company: string
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead'
}

export function DemoModal({ isOpen, onClose, onStartDemo }: DemoModalProps) {
  const [config, setConfig] = useState<DemoConfig>({
    interviewType: 'Technical',
    jobTitle: '',
    company: '',
    experienceLevel: 'Mid'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (config.jobTitle.trim()) {
      onStartDemo(config)
      onClose()
    }
  }

  const interviewTypes = [
    {
      type: 'Technical' as const,
      icon: Code,
      title: 'Technical Interview',
      description: 'Coding challenges, algorithms, and system architecture',
      color: 'from-blue-500 to-purple-600'
    },
    {
      type: 'Behavioral' as const,
      icon: Users,
      title: 'Behavioral Interview',
      description: 'Past experiences, leadership, and cultural fit',
      color: 'from-green-500 to-teal-600'
    },
    {
      type: 'System Design' as const,
      icon: Settings,
      title: 'System Design',
      description: 'Architecture, scalability, and design patterns',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="glass-strong rounded-2xl p-8 w-full max-w-2xl border border-slate-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-serif text-gradient">Try Demo Interview</h2>
                  <p className="text-slate-400 text-sm">Experience our AI interviewer in action</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Interview Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Choose Interview Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {interviewTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <motion.button
                        key={type.type}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfig(prev => ({ ...prev, interviewType: type.type }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          config.interviewType === type.type
                            ? 'border-amber-400 bg-amber-400/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-white mb-1">{type.title}</h3>
                        <p className="text-xs text-slate-400">{type.description}</p>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Job Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Title *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={config.jobTitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="e.g., Senior Software Engineer"
                      className="form-input w-full pl-10 pr-4 py-3 text-white placeholder-slate-400 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.company}
                    onChange={(e) => setConfig(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g., Google, Microsoft"
                    className="form-input w-full px-4 py-3 text-white placeholder-slate-400 rounded-lg"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={config.experienceLevel}
                  onChange={(e) => setConfig(prev => ({ ...prev, experienceLevel: e.target.value as any }))}
                  className="form-input w-full px-4 py-3 text-white rounded-lg"
                >
                  <option value="Entry">Entry Level (0-2 years)</option>
                  <option value="Mid">Mid Level (3-5 years)</option>
                  <option value="Senior">Senior Level (6-10 years)</option>
                  <option value="Lead">Lead/Principal (10+ years)</option>
                </select>
              </div>

              {/* Demo Notice */}
              <div className="glass rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">Demo Mode</h4>
                    <p className="text-sm text-blue-300">
                      This is a demonstration of our AI interviewer. Your session won't be saved, 
                      but you'll experience the full interview flow and get sample feedback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!config.jobTitle.trim()}
                className="btn-primary w-full text-slate-900 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Start Demo Interview</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}