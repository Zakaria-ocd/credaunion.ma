import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Creates a Supabase client with SERVICE_ROLE key to bypass RLS.
 * Only use this on the server (API routes, server components).
 */
export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}
