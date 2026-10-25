export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          message: string
          name: string
          status: string
          wants_updates: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          message: string
          name: string
          status?: string
          wants_updates?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          message?: string
          name?: string
          status?: string
          wants_updates?: boolean
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          background: string | null
          cover_url: string | null
          created_at: string
          featured: boolean
          gallery: string[]
          goal: string | null
          id: string
          problem: string | null
          process: string | null
          project_type: string
          results: string | null
          role: string | null
          services: string[]
          slug: string
          sort_order: number
          status: string
          summary: string
          title: string
        }
        Insert: {
          background?: string | null
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          gallery?: string[]
          goal?: string | null
          id?: string
          problem?: string | null
          process?: string | null
          project_type?: string
          results?: string | null
          role?: string | null
          services?: string[]
          slug: string
          sort_order?: number
          status?: string
          summary: string
          title: string
        }
        Update: {
          background?: string | null
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          gallery?: string[]
          goal?: string | null
          id?: string
          problem?: string | null
          process?: string | null
          project_type?: string
          results?: string | null
          role?: string | null
          services?: string[]
          slug?: string
          sort_order?: number
          status?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          approach: string | null
          category: string
          created_at: string
          deliverables: string[]
          hero_headline: string | null
          id: string
          included: string[]
          keywords: string[]
          pricing_note: string | null
          pricing_type: string
          problem: string | null
          slug: string
          sort_order: number
          starting_price: number | null
          status: string
          summary: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          approach?: string | null
          category?: string
          created_at?: string
          deliverables?: string[]
          hero_headline?: string | null
          id?: string
          included?: string[]
          keywords?: string[]
          pricing_note?: string | null
          pricing_type?: string
          problem?: string | null
          slug: string
          sort_order?: number
          starting_price?: number | null
          status?: string
          summary: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          approach?: string | null
          category?: string
          created_at?: string
          deliverables?: string[]
          hero_headline?: string | null
          id?: string
          included?: string[]
          keywords?: string[]
          pricing_note?: string | null
          pricing_type?: string
          problem?: string | null
          slug?: string
          sort_order?: number
          starting_price?: number | null
          status?: string
          summary?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          consent_at: string
          consent_text: string
          created_at: string
          email: string
          id: string
          source: string
          status: string
          unsubscribe_token: string
          unsubscribed_at: string | null
        }
        Insert: {
          consent_at?: string
          consent_text: string
          created_at?: string
          email: string
          id?: string
          source?: string
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Update: {
          consent_at?: string
          consent_text?: string
          created_at?: string
          email?: string
          id?: string
          source?: string
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          company: string | null
          created_at: string
          id: string
          published: boolean
          quote: string
        }
        Insert: {
          author: string
          company?: string | null
          created_at?: string
          id?: string
          published?: boolean
          quote: string
        }
        Update: {
          author?: string
          company?: string | null
          created_at?: string
          id?: string
          published?: boolean
          quote?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
