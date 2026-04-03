export type GameType = "file" | "link" | "web";
export type Visibility = "public" | "private";
export type GameStatus = "active" | "paused";
export type QuestionType = "text" | "rating" | "multiple_choice" | "yes_no";
export type PlayAgain = "yes" | "maybe" | "no";
export type Cohort = "helsinki" | "san_francisco" | "tokyo";
export type AccountStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          cohort: Cohort | null;
          status: AccountStatus;
          is_admin: boolean;
          supercell_email: string | null;
          review_points: number;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          cohort?: Cohort | null;
          status?: AccountStatus;
          is_admin?: boolean;
          supercell_email?: string | null;
          review_points?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      games: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          cover_image_url: string | null;
          game_type: GameType;
          game_url: string | null;
          file_path: string | null;
          platforms: string[];
          genres: string[];
          visibility: Visibility;
          invite_code: string;
          status: GameStatus;
          is_live: boolean;
          live_session_url: string | null;
          collaborator_ids: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description: string;
          cover_image_url?: string | null;
          game_type: GameType;
          game_url?: string | null;
          file_path?: string | null;
          platforms?: string[];
          genres?: string[];
          visibility?: Visibility;
          invite_code?: string;
          status?: GameStatus;
          is_live?: boolean;
          live_session_url?: string | null;
          collaborator_ids?: string[];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
      };
      feedback_questions: {
        Row: {
          id: string;
          game_id: string;
          question_text: string;
          question_type: QuestionType;
          options: string[] | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          game_id: string;
          question_text: string;
          question_type: QuestionType;
          options?: string[] | null;
          sort_order: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["feedback_questions"]["Insert"]
        >;
      };
      feedback_responses: {
        Row: {
          id: string;
          game_id: string;
          reviewer_id: string;
          overall_rating: number;
          gameplay_rating: number | null;
          gameplay_comment: string | null;
          visuals_rating: number | null;
          visuals_comment: string | null;
          fun_factor_rating: number | null;
          fun_factor_comment: string | null;
          bugs_encountered: string | null;
          would_play_again: PlayAgain;
          free_text: string | null;
          video_links: string[];
          custom_answers: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          reviewer_id: string;
          overall_rating: number;
          gameplay_rating?: number | null;
          gameplay_comment?: string | null;
          visuals_rating?: number | null;
          visuals_comment?: string | null;
          fun_factor_rating?: number | null;
          fun_factor_comment?: string | null;
          bugs_encountered?: string | null;
          would_play_again: PlayAgain;
          free_text?: string | null;
          video_links?: string[];
          custom_answers?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["feedback_responses"]["Insert"]
        >;
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Game = Database["public"]["Tables"]["games"]["Row"];
export type FeedbackQuestion =
  Database["public"]["Tables"]["feedback_questions"]["Row"];
export type FeedbackResponse =
  Database["public"]["Tables"]["feedback_responses"]["Row"];
