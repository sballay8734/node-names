export type DirectConnectionType =
  | "spouse"
  | "parent_child_biological"
  | "parent_child_non_biological"
  | "romantic_partner"
  | "ex_partner";

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

// TODO: expand this to have partner's name maybe?
export type Partner = {
  partner_id: number;
  children_ids: number[] | null;
  status: "current" | "ex";
};

// TODO: expand this to have child's name maybe?
export type Child = {
  child_id: number;
  biological_parents_ids: number[];
  adoptive_parents_ids: number[];
};

// TODO: expand this to have parent's name maybe?
export type Parent = {
  parent_id: number;
  biologial_children_ids: number[];
  adoptive_children_ids: number[];
};

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
          relationship_details: { child: number; parent: number };
        };
        Insert: {
          created_at?: string;
          id?: number;
          relationship_type: RelationshipType;
          source_node_id: number;
          target_node_id: number;
          relationship_details: { child: number; parent: number };
        };
        Update: {
          created_at?: string;
          id?: number;
          relationship_type?: RelationshipType;
          source_node_id?: number;
          target_node_id?: number;
          relationship_details: { child: number; parent: number };
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
          // auto created
          id: number;
          created_at: string;

          // important information
          first_name: string;
          last_name: string | null;
          group_id: number | null;
          group_name: string | null;
          date_of_birth: string | null;
          date_of_death: string | null;
          maiden_name: string | null;
          sex: string;

          partner_details: Partner[] | null;
          parent_details: Parent[] | null;
          children_details: Child[] | null;

          // optional information
          gift_ideas: string[] | null;
          preferred_name: string | null;
          phonetic_name: string | null;
          depth_from_user: number;

          shallowest_ancestor: number;
          is_current_root: boolean;

          // source_node_ids: string[] | null;
          // partner_id: number | null;
          // partner_type: "spouse" | "dating" | "divorced" | null;
          // children_ids: string[] | null;
        };
        Insert: {
          // auto created
          id: number;
          created_at: string;

          // important information
          first_name: string;
          last_name: string | null;
          group_id: number | null;
          group_name: string | null;
          date_of_birth: string | null;
          date_of_death: string | null;
          maiden_name: string | null;
          sex: string;

          partner_details: Partner[] | null;
          parent_details: Parent[] | null;
          children_details: Child[] | null;

          // optional information
          gift_ideas: string[] | null;
          preferred_name: string | null;
          phonetic_name: string | null;
          depth_from_user: number;

          // source_node_ids: string[] | null;
          // partner_id: number | null;
          // partner_type: "spouse" | "dating" | "divorced" | null;
          // children_ids: string[] | null;
        };
        Update: {
          // auto created
          id: number;
          created_at: string;

          // important information
          first_name: string;
          last_name: string | null;
          group_id: number | null;
          group_name: string | null;
          date_of_birth: string | null;
          date_of_death: string | null;
          maiden_name: string | null;
          sex: string;

          partner_details: Partner[] | null;
          parent_details: Parent[] | null;
          children_details: Child[] | null;

          // optional information
          gift_ideas: string[] | null;
          preferred_name: string | null;
          phonetic_name: string | null;
          depth_from_user: number;

          // source_node_ids: string[] | null;
          // partner_id: number | null;
          // partner_type: "spouse" | "dating" | "divorced" | null;
          // children_ids: string[] | null;
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
