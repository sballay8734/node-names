export type DirectConnectionType =
  | "spouse"
  | "parent_child_biological"
  | "parent_child_non_biological"
  | "romantic_partner";

export type RelationshipType =
  | DirectConnectionType
  | "sibling"
  | "half_sibling"
  | "step_sibling"
  | "sibling_in_law"
  | "grandparent_grandchild"
  | "friend"
  | "parent_child_in_law"
  | "coworker"
  | "neighbor"
  | "cousin"
  | "uncle_aunt"
  | "niece_nephew_by_blood"
  | "niece_nephew_by_marriage"
  | "roommate"
  | "family_friend"
  | "acquaintance";

export type Sex = "male" | "female" | "other";

// SUPABASE STUFF BELOW *******************************************************
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      connections: {
        Row: {
          created_at: string;
          id: number;
          relationship_type: RelationshipType;
          source_node_id: number;
          target_node_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          relationship_type: RelationshipType;
          source_node_id: number;
          target_node_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          relationship_type?: RelationshipType;
          source_node_id?: number;
          target_node_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "connection_person_1_id_fkey";
            columns: ["source_node_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "connection_person_2_id_fkey";
            columns: ["target_node_id"];
            isOneToOne: false;
            referencedRelation: "people";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          parent_group_id: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          parent_group_id?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          parent_group_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "group_parent_group_id_fkey";
            columns: ["parent_group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
        ];
      };
      people: {
        Row: {
          created_at: string;
          date_of_birth: string | null;
          date_of_death: string | null;
          first_name: string;
          gift_ideas: string[] | null;
          group_id: number | null;
          group_name: string | null;
          id: number;
          last_name: string | null;
          maiden_name: string | null;
          partner_id: number | null;
          partner_type: "spouse" | "dating" | "divorced" | null;
          phonetic_name: string | null;
          preferred_name: string | null;
          sex: string;
          source_node_ids: string[] | null;
        };
        Insert: {
          created_at?: string;
          date_of_birth?: string | null;
          date_of_death?: string | null;
          first_name: string;
          gift_ideas?: string[] | null;
          group_id?: number | null;
          group_name?: string | null;
          id?: number;
          last_name?: string | null;
          maiden_name?: string | null;
          partner_id?: number | null;
          partner_type?: string | null;
          phonetic_name?: string | null;
          preferred_name?: string | null;
          sex: string;
          source_node_ids?: string[] | null;
        };
        Update: {
          created_at?: string;
          date_of_birth?: string | null;
          date_of_death?: string | null;
          first_name?: string;
          gift_ideas?: string[] | null;
          group_id?: number | null;
          group_name?: string | null;
          id?: number;
          last_name?: string | null;
          maiden_name?: string | null;
          partner_id?: number | null;
          partner_type?: string | null;
          phonetic_name?: string | null;
          preferred_name?: string | null;
          sex?: string;
          source_node_ids?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "person_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
