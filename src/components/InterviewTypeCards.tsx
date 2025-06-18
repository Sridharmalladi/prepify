import React from 'react'
import { motion } from 'framer-motion'
import { Code, Users, Settings, Zap, TrendingUp, Target, Award, CheckCircle } from 'lucide-react'

export function InterviewTypeCards() {
  const primaryTypes = [
    {
      name: 'Technical Interviews',
      description: 'Coding challenges & algorithms',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
      icon: Code,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Behavioral Interviews',
      description: 'Past experiences & soft skills',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      icon: Users,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      name: 'System Design',
      description: 'Architecture & scalability',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
      icon: Settings,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      name: 'Mock Interviews',
      description: 'Realistic practice sessions',
      image: 'https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg',
      icon: Award,
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  const secondaryTypes = [
    {
      name: 'FAANG Prep',
      description: 'Big tech company focus',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Startup Interviews',
      description: 'Fast-paced environment prep',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Leadership Roles',
      description: 'Management & strategy',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      icon: Target,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      name: 'Career Transitions',
      description: 'Switching industries',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg',
      icon: CheckCircle,
      gradient: 'from-rose-500 to-pink-600'
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

  const cardVariants = {
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

  const CardGrid = ({ types, title }: { types: typeof primaryTypes, title: string }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-12"
    >
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-semibold text-center mb-8 text-gradient"
      >
        {title}
      </motion.h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {types.map((type, index) => {
          const IconComponent = type.icon
          return (
            <motion.div
              key={type.name}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
              <div className="glass-strong rounded-xl overflow-hidden border border-slate-700/30 hover:border-amber-400/50 transition-all duration-300">
                <div className="aspect-square overflow-hidden relative">
                  <motion.img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="absolute top-4 right-4"
                  >
                    <div className={`glass p-2 rounded-lg bg-gradient-to-r ${type.gradient}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                  </motion.div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
                    {type.name}
                  </h4>
                  <p className="text-sm text-slate-300">{type.description}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gradient">
            Master Every Interview Type
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From technical coding challenges to behavioral assessments, 
            practice with our comprehensive suite of interview simulations.
          </p>
        </motion.div>

        <CardGrid types={primaryTypes} title="Core Interview Types" />
        <CardGrid types={secondaryTypes} title="Specialized Preparation" />
      </div>
    </section>
  )
}