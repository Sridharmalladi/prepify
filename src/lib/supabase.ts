// Mock Supabase client for frontend-only development
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock auth state change
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    },
    signInWithOAuth: () => Promise.resolve({ error: null }),
    signInWithPassword: () => Promise.resolve({ error: null }),
    signUp: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ error: null }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    }),
    upsert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: '1', user_id: '1', target_score: 85 }, error: null })
      })
    })
  })
}

// Mock types for frontend development
export type DiaryEntry = {
  id: string
  user_id: string
  figure: string
  subject: string
  summary: string
  created_at: string
}

export type FigurePrompt = {
  id: string
  name: string
  prompt: string
  description?: string
  era?: string
}

export type FigureTopicPrompt = {
  id: string
  figure_name: string
  topic: string
  prompt: string
  created_at: string
}

export type InterviewSession = {
  id: string
  user_id: string
  role: string
  company: string
  interview_type: 'Technical' | 'Behavioral' | 'System Design'
  duration: number
  resume: string
  job_description: string
  additional_notes: string
  summary: string
  created_at: string
  score?: number
}

export type UserSettings = {
  id: string
  user_id: string
  target_score: number
  created_at: string
  updated_at: string
}