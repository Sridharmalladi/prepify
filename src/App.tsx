import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })))
const ChatPage = lazy(() => import('./pages/ChatPage').then(module => ({ default: module.ChatPage })))

// Loading component with smooth animation
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-professional text-white flex items-center justify-center"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-300"
      >
        Loading...
      </motion.p>
    </div>
  </motion.div>
)

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ 
      duration: 0.4, 
      ease: [0.175, 0.885, 0.32, 1.275] 
    }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="hardware-accelerated">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <PageTransition>
                      <LandingPage />
                    </PageTransition>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <ChatPage />
                      </PageTransition>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App