import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jcmoakkfcfflxvbyeemq.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjbW9ha2tmY2ZmbHh2YnllZW1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY0MTc5OCwiZXhwIjoyMDg4MjE3Nzk4fQ._aljm7Pf9k9hdVUrh7aXkceqXI-nKod4zjqSdpUApVQ";

async function checkAdmin() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash");
    
    if (error) {
      console.error("Error fetching admin users:", error);
      return;
    }
    
    console.log("Admin users found (count):", data.length);
    data.forEach(user => {
        console.log(`- ID: ${user.id}, Email: ${user.email}, Hash: ${user.password_hash}`);
    });
  } catch (err) {
    console.error("Script execution error:", err);
  }
}

checkAdmin();
