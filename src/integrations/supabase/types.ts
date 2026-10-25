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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          after_snapshot: Json | null
          before_snapshot: Json | null
          created_at: string
          id: string
          ip_address: string | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          after_snapshot?: Json | null
          before_snapshot?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          after_snapshot?: Json | null
          before_snapshot?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      career_history: {
        Row: {
          all_recommendations: Json | null
          created_at: string
          education_level: string
          id: string
          top_match_percent: number | null
          top_recommendation: string | null
          user_id: string
        }
        Insert: {
          all_recommendations?: Json | null
          created_at?: string
          education_level: string
          id?: string
          top_match_percent?: number | null
          top_recommendation?: string | null
          user_id: string
        }
        Update: {
          all_recommendations?: Json | null
          created_at?: string
          education_level?: string
          id?: string
          top_match_percent?: number | null
          top_recommendation?: string | null
          user_id?: string
        }
        Relationships: []
      }
      careers: {
        Row: {
          category: string
          created_at: string | null
          demand: string
          education: string
          entrance_exams: string[] | null
          id: string
          last_verified_at: string | null
          name: string
          official_source_url: string | null
          overview: string | null
          salary_entry: string | null
          salary_mid: string | null
          salary_senior: string | null
          skills: string[] | null
          tagline: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          demand: string
          education: string
          entrance_exams?: string[] | null
          id?: string
          last_verified_at?: string | null
          name: string
          official_source_url?: string | null
          overview?: string | null
          salary_entry?: string | null
          salary_mid?: string | null
          salary_senior?: string | null
          skills?: string[] | null
          tagline?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          demand?: string
          education?: string
          entrance_exams?: string[] | null
          id?: string
          last_verified_at?: string | null
          name?: string
          official_source_url?: string | null
          overview?: string | null
          salary_entry?: string | null
          salary_mid?: string | null
          salary_senior?: string | null
          skills?: string[] | null
          tagline?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          courses: string[] | null
          created_at: string
          cutoffs: string | null
          description: string | null
          id: string
          last_verified_at: string | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          rank: string | null
          rating: number | null
          website: string | null
        }
        Insert: {
          courses?: string[] | null
          created_at?: string
          cutoffs?: string | null
          description?: string | null
          id?: string
          last_verified_at?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          rank?: string | null
          rating?: number | null
          website?: string | null
        }
        Update: {
          courses?: string[] | null
          created_at?: string
          cutoffs?: string | null
          description?: string | null
          id?: string
          last_verified_at?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          rank?: string | null
          rating?: number | null
          website?: string | null
        }
        Relationships: []
      }
      content_reviews: {
        Row: {
          after_snapshot: Json | null
          before_snapshot: Json | null
          comments: string | null
          content_id: string | null
          content_kind: string
          created_at: string | null
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          submitter_id: string | null
          title: string | null
        }
        Insert: {
          after_snapshot?: Json | null
          before_snapshot?: Json | null
          comments?: string | null
          content_id?: string | null
          content_kind: string
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          submitter_id?: string | null
          title?: string | null
        }
        Update: {
          after_snapshot?: Json | null
          before_snapshot?: Json | null
          comments?: string | null
          content_id?: string | null
          content_kind?: string
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          submitter_id?: string | null
          title?: string | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          apply_url: string | null
          attempts: string | null
          authority: string
          category: string | null
          created_at: string | null
          eligibility_snapshot: string[] | null
          exam_mode: string | null
          exam_window: string | null
          fee_info: string | null
          how_to_apply: string[] | null
          id: string
          last_verified_at: string | null
          last_verified_on: string | null
          name: string
          official_notice_url: string | null
          official_website: string | null
          pathways: string[] | null
          registration_window: string | null
          result_window: string | null
          things_to_know: string[] | null
        }
        Insert: {
          apply_url?: string | null
          attempts?: string | null
          authority: string
          category?: string | null
          created_at?: string | null
          eligibility_snapshot?: string[] | null
          exam_mode?: string | null
          exam_window?: string | null
          fee_info?: string | null
          how_to_apply?: string[] | null
          id?: string
          last_verified_at?: string | null
          last_verified_on?: string | null
          name: string
          official_notice_url?: string | null
          official_website?: string | null
          pathways?: string[] | null
          registration_window?: string | null
          result_window?: string | null
          things_to_know?: string[] | null
        }
        Update: {
          apply_url?: string | null
          attempts?: string | null
          authority?: string
          category?: string | null
          created_at?: string | null
          eligibility_snapshot?: string[] | null
          exam_mode?: string | null
          exam_window?: string | null
          fee_info?: string | null
          how_to_apply?: string[] | null
          id?: string
          last_verified_at?: string | null
          last_verified_on?: string | null
          name?: string
          official_notice_url?: string | null
          official_website?: string | null
          pathways?: string[] | null
          registration_window?: string | null
          result_window?: string | null
          things_to_know?: string[] | null
        }
        Relationships: []
      }
      impersonations: {
        Row: {
          admin_id: string
          created_at: string | null
          expires_at: string
          id: string
          target_user_id: string
          token: string
          used: boolean | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          target_user_id: string
          token: string
          used?: boolean | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          target_user_id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      schools: {
        Row: {
          board: string | null
          created_at: string
          description: string | null
          fee_range: string | null
          grade_11_cutoff: number | null
          id: string
          last_verified_at: string | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          rating: number | null
          website: string | null
        }
        Insert: {
          board?: string | null
          created_at?: string
          description?: string | null
          fee_range?: string | null
          grade_11_cutoff?: number | null
          id?: string
          last_verified_at?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          rating?: number | null
          website?: string | null
        }
        Update: {
          board?: string | null
          created_at?: string
          description?: string | null
          fee_range?: string | null
          grade_11_cutoff?: number | null
          id?: string
          last_verified_at?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          rating?: number | null
          website?: string | null
        }
        Relationships: []
      }
      shared_results: {
        Row: {
          created_at: string
          display_name: string | null
          education_level: string
          id: string
          recommendations: Json
          slug: string
          strengths: string | null
          top_match_percent: number | null
          top_recommendation: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          education_level: string
          id?: string
          recommendations: Json
          slug: string
          strengths?: string | null
          top_match_percent?: number | null
          top_recommendation?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          education_level?: string
          id?: string
          recommendations?: Json
          slug?: string
          strengths?: string | null
          top_match_percent?: number | null
          top_recommendation?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      suspended_users: {
        Row: {
          created_at: string | null
          reason: string | null
          suspended_at: string | null
          suspended_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          reason?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          id: string
          location: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          id: string
          location?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          phone_number?: string | null
          updated_at?: string | null
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
      grouped_colleges: {
        Row: {
          branch_count: number | null
          id: string | null
          last_verified_at: string | null
          locations: string | null
          name: string | null
          rank: string | null
          rating: number | null
          website: string | null
        }
        Relationships: []
      }
      grouped_schools: {
        Row: {
          boards: string | null
          branch_count: number | null
          fee_range: string | null
          id: string | null
          last_verified_at: string | null
          locations: string | null
          name: string | null
          rating: number | null
          website: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_shared_result_by_slug: {
        Args: { p_slug: string }
        Returns: {
          education_level: string
          strengths: string | null
          recommendations: Json
          top_recommendation: string | null
          top_match_percent: number | null
          display_name: string | null
          created_at: string
        }[]
      }
      clear_educational_data: { Args: never; Returns: undefined }
      get_all_users_with_roles: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
          roles: Database["public"]["Enums"]["app_role"][]
        }[]
      }
      get_db_size: {
        Args: never
        Returns: {
          size: number
        }[]
      }
      get_users_with_roles: {
        Args: never
        Returns: {
          email: string
          roles: string[]
          user_id: string
        }[]
      }
      has_permission: {
        Args: {
          _permission: Database["public"]["Enums"]["app_permission"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_owner: { Args: { _user_id: string }; Returns: boolean }
      log_user_activity: {
        Args: { p_action: string; p_details?: Json; p_user_id: string }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_permission:
        | "view_all"
        | "edit_careers"
        | "edit_colleges"
        | "edit_schools"
        | "edit_pathways"
        | "edit_quiz"
        | "view_users"
        | "manage_users"
        | "manage_roles"
        | "manage_permissions"
        | "view_audit_logs"
        | "export_data"
        | "revamp_admin"
      app_role: "admin" | "user" | "editor" | "manager" | "owner"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_permission: [
        "view_all",
        "edit_careers",
        "edit_colleges",
        "edit_schools",
        "edit_pathways",
        "edit_quiz",
        "view_users",
        "manage_users",
        "manage_roles",
        "manage_permissions",
        "view_audit_logs",
        "export_data",
        "revamp_admin",
      ],
      app_role: ["admin", "user", "editor", "manager", "owner"],
    },
  },
} as const
