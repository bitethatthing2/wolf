export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notification_subscriptions: {
        Row: {
          id: string
          created_at: string
          endpoint: string
          p256dh: string
          auth: string
          user_agent: string
          last_active: string
        }
        Insert: {
          id?: string
          created_at?: string
          endpoint: string
          p256dh: string
          auth: string
          user_agent: string
          last_active?: string
        }
        Update: {
          id?: string
          created_at?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          user_agent?: string
          last_active?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}