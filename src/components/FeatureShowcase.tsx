import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, TrendingUp, Zap, Award, Users, MessageCircle, BarChart3 } from 'lucide-react'

export function FeatureShowcase() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Interviews',
      description: 'Advanced AI that adapts to your responses and provides realistic scenarios',
      gradient: 'from-blue-500 to-purple-600',
      delay: 0.1
    },
    {
      icon: Target,
      title: 'Targeted Practice',
      description: 'Focus on specific interview types and get personalized feedback',
      gradient: 'from-amber-500 to-orange-600',
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and insights',
      gradient: 'from-green-500 to-teal-600',
      delay: 0.3
    },
    {
      icon: MessageCircle,
      title: 'Real-time Feedback',
      description: 'Get instant feedback on your responses and communication style',
      gradient: 'from-purple-500 to-pink-600',
      delay: 0.4
    },
    {
      icon: Award,
      title: 'Industry Standards',
      description: 'Practice with questions from top tech companies and startups',
      gradient: 'from-red-500 to-orange-600',
      delay: 0.5
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed scoring and recommendations for improvement',
      gradient: 'from-indigo-500 to-blue-600',
      delay: 0.6
    }
  ]

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
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gradient">
            Why Choose AI Interview Prep?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of interview preparation with cutting-edge AI technology 
            designed to help you succeed in today's competitive job market.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <div className="glass-strong rounded-2xl p-8 h-full border border-slate-700/30 hover:border-amber-400/30 transition-all duration-300">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-4 font-serif group-hover:text-amber-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}