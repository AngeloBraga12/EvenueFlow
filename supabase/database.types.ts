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
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json
          organization_id: string
          project_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          organization_id: string
          project_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          organization_id?: string
          project_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      circulation_analyses: {
        Row: {
          blocked_segments: Json
          bottlenecks: Json
          created_at: string
          id: string
          layout_id: string
          metrics: Json
          navigable_area: Json
          report: Json
          requested_by: string
          route_profile: string
          routes: Json
        }
        Insert: {
          blocked_segments?: Json
          bottlenecks?: Json
          created_at?: string
          id?: string
          layout_id: string
          metrics?: Json
          navigable_area: Json
          report?: Json
          requested_by: string
          route_profile?: string
          routes?: Json
        }
        Update: {
          blocked_segments?: Json
          bottlenecks?: Json
          created_at?: string
          id?: string
          layout_id?: string
          metrics?: Json
          navigable_area?: Json
          report?: Json
          requested_by?: string
          route_profile?: string
          routes?: Json
        }
        Relationships: [
          {
            foreignKeyName: "circulation_analyses_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circulation_analyses_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          ends_at: string | null
          expected_guest_count: number
          id: string
          metadata: Json
          name: string
          organization_id: string
          project_id: string
          starts_at: string | null
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          ends_at?: string | null
          expected_guest_count?: number
          id?: string
          metadata?: Json
          name: string
          organization_id: string
          project_id: string
          starts_at?: string | null
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          ends_at?: string | null
          expected_guest_count?: number
          id?: string
          metadata?: Json
          name?: string
          organization_id?: string
          project_id?: string
          starts_at?: string | null
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_project_id_organization_id_fkey"
            columns: ["project_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "events_venue_same_project_fk"
            columns: ["venue_id", "project_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id", "project_id", "organization_id"]
          },
        ]
      }
      exports: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_path: string | null
          file_size_bytes: number | null
          format: Database["public"]["Enums"]["export_format"]
          id: string
          layout_id: string | null
          options: Json
          project_id: string
          requested_by: string
          status: Database["public"]["Enums"]["export_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          format: Database["public"]["Enums"]["export_format"]
          id?: string
          layout_id?: string | null
          options?: Json
          project_id: string
          requested_by: string
          status?: Database["public"]["Enums"]["export_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          format?: Database["public"]["Enums"]["export_format"]
          id?: string
          layout_id?: string | null
          options?: Json
          project_id?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["export_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      furniture_types: {
        Row: {
          category: Database["public"]["Enums"]["layout_object_type"]
          created_at: string
          default_capacity: number
          default_properties: Json
          deleted_at: string | null
          depth_mm: number
          footprint: Json
          height_mm: number | null
          id: string
          name: string
          organization_id: string
          updated_at: string
          width_mm: number
        }
        Insert: {
          category: Database["public"]["Enums"]["layout_object_type"]
          created_at?: string
          default_capacity?: number
          default_properties?: Json
          deleted_at?: string | null
          depth_mm: number
          footprint: Json
          height_mm?: number | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string
          width_mm: number
        }
        Update: {
          category?: Database["public"]["Enums"]["layout_object_type"]
          created_at?: string
          default_capacity?: number
          default_properties?: Json
          deleted_at?: string | null
          depth_mm?: number
          footprint?: Json
          height_mm?: number | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
          width_mm?: number
        }
        Relationships: [
          {
            foreignKeyName: "furniture_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_groups: {
        Row: {
          color: string | null
          created_at: string
          deleted_at: string | null
          event_id: string
          id: string
          kind: Database["public"]["Enums"]["guest_group_kind"]
          metadata: Json
          must_stay_together: boolean
          name: string
          priority: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          deleted_at?: string | null
          event_id: string
          id?: string
          kind?: Database["public"]["Enums"]["guest_group_kind"]
          metadata?: Json
          must_stay_together?: boolean
          name: string
          priority?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          deleted_at?: string | null
          event_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["guest_group_kind"]
          metadata?: Json
          must_stay_together?: boolean
          name?: string
          priority?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_imports: {
        Row: {
          column_mapping: Json
          completed_at: string | null
          created_at: string
          error_count: number
          event_id: string
          file_name: string
          file_size_bytes: number
          id: string
          imported_count: number
          mime_type: string
          requested_by: string
          status: Database["public"]["Enums"]["import_status"]
          updated_at: string
          validation_report: Json
        }
        Insert: {
          column_mapping?: Json
          completed_at?: string | null
          created_at?: string
          error_count?: number
          event_id: string
          file_name: string
          file_size_bytes: number
          id?: string
          imported_count?: number
          mime_type: string
          requested_by: string
          status?: Database["public"]["Enums"]["import_status"]
          updated_at?: string
          validation_report?: Json
        }
        Update: {
          column_mapping?: Json
          completed_at?: string | null
          created_at?: string
          error_count?: number
          event_id?: string
          file_name?: string
          file_size_bytes?: number
          id?: string
          imported_count?: number
          mime_type?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["import_status"]
          updated_at?: string
          validation_report?: Json
        }
        Relationships: [
          {
            foreignKeyName: "guest_imports_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_imports_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          accessibility_needs: boolean
          attendance_status: Database["public"]["Enums"]["guest_attendance_status"]
          created_at: string
          deleted_at: string | null
          email: string | null
          event_id: string
          external_reference: string | null
          full_name: string
          group_id: string | null
          id: string
          metadata: Json
          notes: string | null
          party_size: number
          phone: string | null
          updated_at: string
        }
        Insert: {
          accessibility_needs?: boolean
          attendance_status?: Database["public"]["Enums"]["guest_attendance_status"]
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          event_id: string
          external_reference?: string | null
          full_name: string
          group_id?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          party_size?: number
          phone?: string | null
          updated_at?: string
        }
        Update: {
          accessibility_needs?: boolean
          attendance_status?: Database["public"]["Enums"]["guest_attendance_status"]
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          event_id?: string
          external_reference?: string | null
          full_name?: string
          group_id?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          party_size?: number
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "guest_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          available_quantity: number
          created_at: string
          deleted_at: string | null
          furniture_type_id: string
          id: string
          metadata: Json
          name: string
          organization_id: string
          reserved_quantity: number
          unit_cost_cents: number | null
          updated_at: string
        }
        Insert: {
          available_quantity?: number
          created_at?: string
          deleted_at?: string | null
          furniture_type_id: string
          id?: string
          metadata?: Json
          name: string
          organization_id: string
          reserved_quantity?: number
          unit_cost_cents?: number | null
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          created_at?: string
          deleted_at?: string | null
          furniture_type_id?: string
          id?: string
          metadata?: Json
          name?: string
          organization_id?: string
          reserved_quantity?: number
          unit_cost_cents?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_furniture_type_id_fkey"
            columns: ["furniture_type_id"]
            isOneToOne: false
            referencedRelation: "furniture_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      layout_group_members: {
        Row: {
          created_at: string
          group_id: string
          object_id: string
          relative_position_x_mm: number
          relative_position_y_mm: number
          relative_rotation_deg: number
        }
        Insert: {
          created_at?: string
          group_id: string
          object_id: string
          relative_position_x_mm?: number
          relative_position_y_mm?: number
          relative_rotation_deg?: number
        }
        Update: {
          created_at?: string
          group_id?: string
          object_id?: string
          relative_position_x_mm?: number
          relative_position_y_mm?: number
          relative_rotation_deg?: number
        }
        Relationships: [
          {
            foreignKeyName: "layout_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "layout_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_group_members_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "layout_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      layout_groups: {
        Row: {
          anchor_object_id: string | null
          created_at: string
          deleted_at: string | null
          id: string
          layout_id: string
          metadata: Json
          name: string
          transform: Json
          updated_at: string
        }
        Insert: {
          anchor_object_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          layout_id: string
          metadata?: Json
          name: string
          transform?: Json
          updated_at?: string
        }
        Update: {
          anchor_object_id?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          layout_id?: string
          metadata?: Json
          name?: string
          transform?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "layout_groups_anchor_object_id_fkey"
            columns: ["anchor_object_id"]
            isOneToOne: false
            referencedRelation: "layout_objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_groups_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      layout_object_constraints: {
        Row: {
          constraint_type: Database["public"]["Enums"]["object_constraint_type"]
          created_at: string
          deleted_at: string | null
          id: string
          is_mandatory: boolean
          layout_id: string
          object_id: string
          parameters: Json
          target_object_id: string | null
          updated_at: string
        }
        Insert: {
          constraint_type: Database["public"]["Enums"]["object_constraint_type"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_mandatory?: boolean
          layout_id: string
          object_id: string
          parameters?: Json
          target_object_id?: string | null
          updated_at?: string
        }
        Update: {
          constraint_type?: Database["public"]["Enums"]["object_constraint_type"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_mandatory?: boolean
          layout_id?: string
          object_id?: string
          parameters?: Json
          target_object_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "layout_object_constraints_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_object_constraints_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "layout_objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_object_constraints_target_object_id_fkey"
            columns: ["target_object_id"]
            isOneToOne: false
            referencedRelation: "layout_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      layout_objects: {
        Row: {
          capacity: number
          created_at: string
          deleted_at: string | null
          depth_mm: number
          furniture_type_id: string | null
          geometry: Json
          height_mm: number | null
          id: string
          inventory_item_id: string | null
          is_locked: boolean
          is_visible: boolean
          layout_id: string
          name: string | null
          object_type: Database["public"]["Enums"]["layout_object_type"]
          position_x_mm: number
          position_y_mm: number
          position_z_mm: number
          properties: Json
          rotation_deg: number
          updated_at: string
          width_mm: number
        }
        Insert: {
          capacity?: number
          created_at?: string
          deleted_at?: string | null
          depth_mm: number
          furniture_type_id?: string | null
          geometry: Json
          height_mm?: number | null
          id?: string
          inventory_item_id?: string | null
          is_locked?: boolean
          is_visible?: boolean
          layout_id: string
          name?: string | null
          object_type: Database["public"]["Enums"]["layout_object_type"]
          position_x_mm?: number
          position_y_mm?: number
          position_z_mm?: number
          properties?: Json
          rotation_deg?: number
          updated_at?: string
          width_mm: number
        }
        Update: {
          capacity?: number
          created_at?: string
          deleted_at?: string | null
          depth_mm?: number
          furniture_type_id?: string | null
          geometry?: Json
          height_mm?: number | null
          id?: string
          inventory_item_id?: string | null
          is_locked?: boolean
          is_visible?: boolean
          layout_id?: string
          name?: string | null
          object_type?: Database["public"]["Enums"]["layout_object_type"]
          position_x_mm?: number
          position_y_mm?: number
          position_z_mm?: number
          properties?: Json
          rotation_deg?: number
          updated_at?: string
          width_mm?: number
        }
        Relationships: [
          {
            foreignKeyName: "layout_objects_furniture_type_id_fkey"
            columns: ["furniture_type_id"]
            isOneToOne: false
            referencedRelation: "furniture_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_objects_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_objects_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      layouts: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          event_id: string | null
          id: string
          is_current: boolean
          name: string
          project_id: string
          settings: Json
          status: string
          updated_at: string
          venue_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          event_id?: string | null
          id?: string
          is_current?: boolean
          name: string
          project_id: string
          settings?: Json
          status?: string
          updated_at?: string
          venue_id: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          event_id?: string | null
          id?: string
          is_current?: boolean
          name?: string
          project_id?: string
          settings?: Json
          status?: string
          updated_at?: string
          venue_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "layouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layouts_event_id_project_id_fkey"
            columns: ["event_id", "project_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "project_id"]
          },
          {
            foreignKeyName: "layouts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layouts_venue_id_project_id_fkey"
            columns: ["venue_id", "project_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id", "project_id"]
          },
        ]
      }
      operation_conflicts: {
        Row: {
          conflict_type: string
          conflicting_operation_id: string
          created_at: string
          entity_id: string | null
          id: string
          operation_id: string
          resolution_strategy: string | null
          resolved_at: string | null
          resolved_operation_id: string | null
        }
        Insert: {
          conflict_type: string
          conflicting_operation_id: string
          created_at?: string
          entity_id?: string | null
          id?: string
          operation_id: string
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_operation_id?: string | null
        }
        Update: {
          conflict_type?: string
          conflicting_operation_id?: string
          created_at?: string
          entity_id?: string | null
          id?: string
          operation_id?: string
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_operation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operation_conflicts_conflicting_operation_id_fkey"
            columns: ["conflicting_operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operation_conflicts_operation_id_fkey"
            columns: ["operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operation_conflicts_resolved_operation_id_fkey"
            columns: ["resolved_operation_id"]
            isOneToOne: false
            referencedRelation: "operations"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          actor_id: string
          base_revision: number
          client_created_at: string
          confirmed_at: string | null
          conflict_reason: string | null
          created_at: string
          entity_id: string | null
          entity_table: string | null
          id: string
          layout_id: string | null
          metadata: Json
          operation_type: Database["public"]["Enums"]["operation_type"]
          payload: Json
          project_id: string
          resulting_revision: number | null
          server_received_at: string | null
          status: Database["public"]["Enums"]["operation_status"]
          updated_at: string
        }
        Insert: {
          actor_id: string
          base_revision: number
          client_created_at: string
          confirmed_at?: string | null
          conflict_reason?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table?: string | null
          id: string
          layout_id?: string | null
          metadata?: Json
          operation_type: Database["public"]["Enums"]["operation_type"]
          payload: Json
          project_id: string
          resulting_revision?: number | null
          server_received_at?: string | null
          status?: Database["public"]["Enums"]["operation_status"]
          updated_at?: string
        }
        Update: {
          actor_id?: string
          base_revision?: number
          client_created_at?: string
          confirmed_at?: string | null
          conflict_reason?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table?: string | null
          id?: string
          layout_id?: string | null
          metadata?: Json
          operation_type?: Database["public"]["Enums"]["operation_type"]
          payload?: Json
          project_id?: string
          resulting_revision?: number | null
          server_received_at?: string | null
          status?: Database["public"]["Enums"]["operation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operations_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operations_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_proposals: {
        Row: {
          constraints_satisfied: Json
          constraints_violated: Json
          created_at: string
          diff: Json
          id: string
          objectives: Json
          optimization_run_id: string
          project_id: string
          proposed_layout_id: string | null
          quality_metrics: Json
          score: number | null
          source_layout_id: string
          title: string
        }
        Insert: {
          constraints_satisfied?: Json
          constraints_violated?: Json
          created_at?: string
          diff?: Json
          id?: string
          objectives?: Json
          optimization_run_id: string
          project_id: string
          proposed_layout_id?: string | null
          quality_metrics?: Json
          score?: number | null
          source_layout_id: string
          title: string
        }
        Update: {
          constraints_satisfied?: Json
          constraints_violated?: Json
          created_at?: string
          diff?: Json
          id?: string
          objectives?: Json
          optimization_run_id?: string
          project_id?: string
          proposed_layout_id?: string | null
          quality_metrics?: Json
          score?: number | null
          source_layout_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_proposals_optimization_run_id_fkey"
            columns: ["optimization_run_id"]
            isOneToOne: false
            referencedRelation: "optimization_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_proposals_proposed_layout_id_fkey"
            columns: ["proposed_layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_proposals_source_layout_id_fkey"
            columns: ["source_layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_runs: {
        Row: {
          algorithm: string
          created_at: string
          error_message: string | null
          event_id: string | null
          finished_at: string | null
          id: string
          input_snapshot: Json
          layout_id: string
          parameters: Json
          project_id: string
          requested_by: string
          started_at: string | null
          status: Database["public"]["Enums"]["optimization_status"]
          updated_at: string
        }
        Insert: {
          algorithm: string
          created_at?: string
          error_message?: string | null
          event_id?: string | null
          finished_at?: string | null
          id?: string
          input_snapshot: Json
          layout_id: string
          parameters?: Json
          project_id: string
          requested_by: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["optimization_status"]
          updated_at?: string
        }
        Update: {
          algorithm?: string
          created_at?: string
          error_message?: string | null
          event_id?: string | null
          finished_at?: string | null
          id?: string
          input_snapshot?: Json
          layout_id?: string
          parameters?: Json
          project_id?: string
          requested_by?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["optimization_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_runs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_runs_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_runs_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          deleted_at: string | null
          invited_by: string | null
          joined_at: string
          organization_id: string
          role: Database["public"]["Enums"]["organization_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          invited_by?: string | null
          joined_at?: string
          organization_id: string
          role?: Database["public"]["Enums"]["organization_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          invited_by?: string | null
          joined_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["organization_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          metadata: Json
          name: string
          owner_user_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          metadata?: Json
          name: string
          owner_user_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          metadata?: Json
          name?: string
          owner_user_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_versions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          label: string | null
          project_id: string
          snapshot: Json
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          label?: string | null
          project_id: string
          snapshot?: Json
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          label?: string | null
          project_id?: string
          snapshot?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string
          current_version: number
          deleted_at: string | null
          description: string | null
          id: string
          metadata: Json
          name: string
          organization_id: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_version?: number
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          organization_id: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_version?: number
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_fixed_structures: {
        Row: {
          created_at: string
          deleted_at: string | null
          geometry: Json
          id: string
          metadata: Json
          name: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          geometry: Json
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          geometry?: Json
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_fixed_structures_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_obstacles: {
        Row: {
          blocks_circulation: boolean
          created_at: string
          deleted_at: string | null
          geometry: Json
          id: string
          metadata: Json
          name: string
          updated_at: string
          venue_id: string
        }
        Insert: {
          blocks_circulation?: boolean
          created_at?: string
          deleted_at?: string | null
          geometry: Json
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
          venue_id: string
        }
        Update: {
          blocks_circulation?: boolean
          created_at?: string
          deleted_at?: string | null
          geometry?: Json
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_obstacles_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_openings: {
        Row: {
          created_at: string
          deleted_at: string | null
          height_mm: number | null
          id: string
          is_essential: boolean
          metadata: Json
          opening_type: Database["public"]["Enums"]["opening_type"]
          rotation_deg: number
          updated_at: string
          venue_id: string
          width_mm: number
          x_mm: number
          y_mm: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          height_mm?: number | null
          id?: string
          is_essential?: boolean
          metadata?: Json
          opening_type: Database["public"]["Enums"]["opening_type"]
          rotation_deg?: number
          updated_at?: string
          venue_id: string
          width_mm: number
          x_mm: number
          y_mm: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          height_mm?: number | null
          id?: string
          is_essential?: boolean
          metadata?: Json
          opening_type?: Database["public"]["Enums"]["opening_type"]
          rotation_deg?: number
          updated_at?: string
          venue_id?: string
          width_mm?: number
          x_mm?: number
          y_mm?: number
        }
        Relationships: [
          {
            foreignKeyName: "venue_openings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_walls: {
        Row: {
          created_at: string
          deleted_at: string | null
          end_x_mm: number
          end_y_mm: number
          height_mm: number | null
          id: string
          metadata: Json
          start_x_mm: number
          start_y_mm: number
          thickness_mm: number
          updated_at: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          end_x_mm: number
          end_y_mm: number
          height_mm?: number | null
          id?: string
          metadata?: Json
          start_x_mm: number
          start_y_mm: number
          thickness_mm?: number
          updated_at?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          end_x_mm?: number
          end_y_mm?: number
          height_mm?: number | null
          id?: string
          metadata?: Json
          start_x_mm?: number
          start_y_mm?: number
          thickness_mm?: number
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_walls_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          boundary: Json
          ceiling_height_mm: number | null
          created_at: string
          created_by: string
          deleted_at: string | null
          height_mm: number
          id: string
          metadata: Json
          name: string
          organization_id: string
          origin_x_mm: number
          origin_y_mm: number
          project_id: string
          shape: Database["public"]["Enums"]["venue_shape"]
          updated_at: string
          width_mm: number
        }
        Insert: {
          boundary: Json
          ceiling_height_mm?: number | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          height_mm: number
          id?: string
          metadata?: Json
          name: string
          organization_id: string
          origin_x_mm?: number
          origin_y_mm?: number
          project_id: string
          shape?: Database["public"]["Enums"]["venue_shape"]
          updated_at?: string
          width_mm: number
        }
        Update: {
          boundary?: Json
          ceiling_height_mm?: number | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          height_mm?: number
          id?: string
          metadata?: Json
          name?: string
          organization_id?: string
          origin_x_mm?: number
          origin_y_mm?: number
          project_id?: string
          shape?: Database["public"]["Enums"]["venue_shape"]
          updated_at?: string
          width_mm?: number
        }
        Relationships: [
          {
            foreignKeyName: "venues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_project_id_organization_id_fkey"
            columns: ["project_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      export_format: "pdf" | "png" | "vflow"
      export_status: "queued" | "processing" | "completed" | "failed"
      guest_attendance_status: "pending" | "confirmed" | "declined" | "maybe"
      guest_group_kind:
        | "family"
        | "friends"
        | "couple"
        | "vip"
        | "accessibility"
        | "staff"
        | "custom"
      import_status:
        | "draft"
        | "mapping"
        | "preview"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      layout_object_type:
        | "table"
        | "chair"
        | "stage"
        | "dance_floor"
        | "bar"
        | "buffet"
        | "decoration"
        | "equipment"
        | "custom"
      object_constraint_type:
        | "fixed_position"
        | "no_overlap"
        | "keep_clearance"
        | "must_be_near"
        | "must_not_be_near"
        | "custom"
      opening_type: "door" | "window" | "emergency_exit" | "service_entrance"
      operation_status:
        | "local"
        | "pending"
        | "sent"
        | "confirmed"
        | "conflict"
        | "failed"
        | "discarded"
      operation_type:
        | "create_layout_object"
        | "update_layout_object"
        | "move_layout_object"
        | "rotate_layout_object"
        | "resize_layout_object"
        | "delete_layout_object"
        | "create_layout_group"
        | "update_layout_group"
        | "delete_layout_group"
        | "apply_optimization_proposal"
        | "update_venue_geometry"
        | "custom"
      optimization_status:
        | "queued"
        | "running"
        | "completed"
        | "failed"
        | "cancelled"
      organization_role: "owner" | "admin" | "editor" | "viewer"
      project_status: "draft" | "active" | "archived"
      venue_shape: "rectangle" | "polygon" | "custom"
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
      export_format: ["pdf", "png", "vflow"],
      export_status: ["queued", "processing", "completed", "failed"],
      guest_attendance_status: ["pending", "confirmed", "declined", "maybe"],
      guest_group_kind: [
        "family",
        "friends",
        "couple",
        "vip",
        "accessibility",
        "staff",
        "custom",
      ],
      import_status: [
        "draft",
        "mapping",
        "preview",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      layout_object_type: [
        "table",
        "chair",
        "stage",
        "dance_floor",
        "bar",
        "buffet",
        "decoration",
        "equipment",
        "custom",
      ],
      object_constraint_type: [
        "fixed_position",
        "no_overlap",
        "keep_clearance",
        "must_be_near",
        "must_not_be_near",
        "custom",
      ],
      opening_type: ["door", "window", "emergency_exit", "service_entrance"],
      operation_status: [
        "local",
        "pending",
        "sent",
        "confirmed",
        "conflict",
        "failed",
        "discarded",
      ],
      operation_type: [
        "create_layout_object",
        "update_layout_object",
        "move_layout_object",
        "rotate_layout_object",
        "resize_layout_object",
        "delete_layout_object",
        "create_layout_group",
        "update_layout_group",
        "delete_layout_group",
        "apply_optimization_proposal",
        "update_venue_geometry",
        "custom",
      ],
      optimization_status: [
        "queued",
        "running",
        "completed",
        "failed",
        "cancelled",
      ],
      organization_role: ["owner", "admin", "editor", "viewer"],
      project_status: ["draft", "active", "archived"],
      venue_shape: ["rectangle", "polygon", "custom"],
    },
  },
} as const
