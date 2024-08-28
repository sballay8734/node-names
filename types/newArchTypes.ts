// GRAPH SLICE *****************************************************************

export type VertexStatus = "active" | "parent_active" | "inactive";
export type EdgeStatus = "active" | "inactive";

// RAW Types from DB WITHOUT ui related properties
// vertex/node
export interface RawVertex {
  id: number;
  user_id: string;
  created_at: string;
  is_user: boolean;
  first_name: string;
  last_name: string | null;
  sex: NewDatabase["public"]["Enums"]["sexes"];

  date_of_birth: string | null;
  date_of_death: string | null;
  gift_ideas: string[] | null;
  group_id: number | null;

  maiden_name: string | null;
  phonetic_name: string | null;
  preferred_name: string | null;
}
// edge/link
export interface RawEdge {
  id: number;
  created_at: string;
  user_id: string;
  relationship_type: NewDatabase["public"]["Enums"]["relationship_types"];

  is_active_romance: boolean;
  is_parent_child: boolean;
  parent_id: number | null;
  child_id: number | null;

  vertex_1_id: number;
  vertex_2_id: number;
}
// group
export interface RawGroup {
  created_at: string;
  group_name: NewDatabase["public"]["Enums"]["group_names"] | null;
  id: number;
  user_id: string;
  parent_group_id: number | null;
}

// UI Extensions of Raw types WITH Added ui controlling properties ************
export interface UiVertex extends RawVertex {
  isCurrentRoot: boolean;
  vertex_status: VertexStatus;
}
export interface UiEdge extends RawEdge {
  vertex_1_status: VertexStatus;
  vertex_2_status: VertexStatus;
  edge_status: EdgeStatus;
}
export interface UiGroup extends RawGroup {}

// TS GENERATED BY SUPABASE
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type NewDatabase = {
  public: {
    Tables: {
      edges: {
        Row: {
          child_id: number | null;
          created_at: string;
          id: number;
          is_active_romance: boolean;
          is_parent_child: boolean;
          parent_id: number | null;
          relationship_type: NewDatabase["public"]["Enums"]["relationship_types"];
          user_id: string;
          vertex_1_id: number;
          vertex_2_id: number;
        };
        Insert: {
          child_id?: number | null;
          created_at?: string;
          id?: number;
          is_active_romance: boolean;
          is_parent_child?: boolean;
          parent_id?: number | null;
          relationship_type: NewDatabase["public"]["Enums"]["relationship_types"];
          user_id: string;
          vertex_1_id: number;
          vertex_2_id: number;
        };
        Update: {
          child_id?: number | null;
          created_at?: string;
          id?: number;
          is_active_romance?: boolean;
          is_parent_child?: boolean;
          parent_id?: number | null;
          relationship_type?: NewDatabase["public"]["Enums"]["relationship_types"];
          user_id?: string;
          vertex_1_id?: number;
          vertex_2_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "edges_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "vertices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "edges_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "vertices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "edges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "edges_vertex_1_id_fkey";
            columns: ["vertex_1_id"];
            isOneToOne: false;
            referencedRelation: "vertices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "edges_vertex_2_id_fkey";
            columns: ["vertex_2_id"];
            isOneToOne: false;
            referencedRelation: "vertices";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          group_name: NewDatabase["public"]["Enums"]["group_names"] | null;
          id: number;
          parent_group_id: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          group_name?: NewDatabase["public"]["Enums"]["group_names"] | null;
          id?: number;
          parent_group_id?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          group_name?: NewDatabase["public"]["Enums"]["group_names"] | null;
          id?: number;
          parent_group_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groups_parent_group_id_fkey";
            columns: ["parent_group_id"];
            isOneToOne: true;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "groups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          sex: NewDatabase["public"]["Enums"]["sexes"];
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          sex: NewDatabase["public"]["Enums"]["sexes"];
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          sex?: NewDatabase["public"]["Enums"]["sexes"];
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      vertices: {
        Row: {
          id: number;
          created_at: string;
          date_of_birth: string | null;
          date_of_death: string | null;
          first_name: string;
          gift_ideas: string[] | null;
          group_id: number | null;
          is_user: boolean;
          last_name: string | null;
          maiden_name: string | null;
          phonetic_name: string | null;
          preferred_name: string | null;
          sex: NewDatabase["public"]["Enums"]["sexes"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date_of_birth?: string | null;
          date_of_death?: string | null;
          first_name: string;
          gift_ideas?: string[] | null;
          group_id?: number | null;
          id?: number;
          is_user?: boolean;
          last_name?: string | null;
          maiden_name?: string | null;
          phonetic_name?: string | null;
          preferred_name?: string | null;
          sex: NewDatabase["public"]["Enums"]["sexes"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          date_of_birth?: string | null;
          date_of_death?: string | null;
          first_name?: string;
          gift_ideas?: string[] | null;
          group_id?: number | null;
          id?: number;
          is_user?: boolean;
          last_name?: string | null;
          maiden_name?: string | null;
          phonetic_name?: string | null;
          preferred_name?: string | null;
          sex?: NewDatabase["public"]["Enums"]["sexes"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vertices_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vertices_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      group_names:
        | "friends"
        | "close_friends"
        | "family"
        | "work"
        | "acquaintances";
      relationship_types:
        | "partner"
        | "sibling"
        | "parent_child_non_biological"
        | "parent_child_biological"
        | "friend"
        | "ex_partner"
        | "coworker"
        | "acquaintance";
      sexes: "male" | "female" | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = NewDatabase[Extract<keyof NewDatabase, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof NewDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof NewDatabase;
  }
    ? keyof (NewDatabase[PublicTableNameOrOptions["schema"]]["Tables"] &
        NewDatabase[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof NewDatabase }
  ? (NewDatabase[PublicTableNameOrOptions["schema"]]["Tables"] &
      NewDatabase[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof NewDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof NewDatabase;
  }
    ? keyof NewDatabase[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof NewDatabase }
  ? NewDatabase[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof NewDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof NewDatabase;
  }
    ? keyof NewDatabase[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof NewDatabase }
  ? NewDatabase[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof NewDatabase },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof NewDatabase }
    ? keyof NewDatabase[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof NewDatabase }
  ? NewDatabase[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
