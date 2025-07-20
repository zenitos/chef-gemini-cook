import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          name: string
          ingredients: string[]
          instructions: string[]
          cooking_time: string | null
          servings: string | null
          difficulty: string | null
          tips: string[] | null
          search_query: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          ingredients: string[]
          instructions: string[]
          cooking_time?: string | null
          servings?: string | null
          difficulty?: string | null
          tips?: string[] | null
          search_query: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          ingredients?: string[]
          instructions?: string[]
          cooking_time?: string | null
          servings?: string | null
          difficulty?: string | null
          tips?: string[] | null
          search_query?: string
          created_at?: string
        }
      }
    }
  }
}