import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../supabase/database.types";
let client: SupabaseClient<Database> | null = null;
export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) throw new Error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente.");
  client = createClient<Database>(url, publishableKey, { auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } });
  return client;
}