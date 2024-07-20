// interface Person {
//   id: number;
//   firstName: string;
//   lastName: string | null;
//   maidenName: string | null;
//   groupId: number | null;
//   sex: "male" | "female" | "other";

//   // birthDate: Date;
//   // giftIdeas: string[];
//   // phoneticName: string;
// }

// interface Connection {
//   person1Id: number;
//   person2Id: number;
//   relationshipType: RelationshipType;
// }

// interface Group {
//   id: number;
//   name: string;
//   parentGroupId: number | null;
// }

type RelationshipType =
  | "friend"
  | "spouse"
  | "parent_child_biological"
  | "parent_child_non_biological"
  | "grandparent_grandchild"
  | "sibling_in_law"
  | "parent_child_in_law"
  | "sibling"
  | "half_sibling"
  | "step_sibling"
  | "coworker"
  | "neighbor"
  | "romantic_partner"
  | "ex_spouse"
  | "cousin"
  | "uncle_aunt"
  | "niece_nephew_by_blood"
  | "niece_nephew_by_marriage"
  | "grandparent"
  | "grandchild"
  | "roommate"
  | "family_friend"
  | "acquaintance";

type Sex = "male" | "female" | "other";

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
          person_1_id: number;
          person_2_id: number;
          relationship_type: RelationshipType;
        };
        Insert: {
          created_at?: string;
          id?: number;
          person_1_id: number;
          person_2_id: number;
          relationship_type: RelationshipType;
        };
        Update: {
          created_at?: string;
          id?: number;
          person_1_id?: number;
          person_2_id?: number;
          relationship_type?: RelationshipType;
        };
        Relationships: [
          {
            foreignKeyName: "connection_person_1_id_fkey";
            columns: ["person_1_id"];
            isOneToOne: false;
            referencedRelation: "person";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "connection_person_2_id_fkey";
            columns: ["person_2_id"];
            isOneToOne: false;
            referencedRelation: "person";
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
            referencedRelation: "group";
            referencedColumns: ["id"];
          },
        ];
      };
      people: {
        Row: {
          created_at: string;
          first_name: string;
          group_id: number | null;
          id: number;
          last_name: string | null;
          maiden_name: string | null;
          phonetic_name: string | null;
          sex: Sex;
        };
        Insert: {
          created_at?: string;
          first_name: string;
          group_id?: number | null;
          id?: number;
          last_name?: string | null;
          maiden_name?: string | null;
          phonetic_name?: string | null;
          sex: Sex;
        };
        Update: {
          created_at?: string;
          first_name?: string;
          group_id?: number | null;
          id?: number;
          last_name?: string | null;
          maiden_name?: string | null;
          phonetic_name?: string | null;
          sex?: Sex;
        };
        Relationships: [
          {
            foreignKeyName: "person_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "group";
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
