import { createAdminClient } from "./utils/supabase/admin.js";

async function checkAdmin() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, password_hash");
  
  if (error) {
    console.error("Error fetching admin users:", error);
    return;
  }
  
  console.log("Admin users found:", data);
}

checkAdmin();
