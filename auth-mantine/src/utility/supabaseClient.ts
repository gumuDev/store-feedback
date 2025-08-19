import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://khnkxrzmxgojnwjwlvex.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtobmt4cnpteGdvam53andsdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDE0NDAsImV4cCI6MjA3MTA3NzQ0MH0.cmkMFYhLyie86JympvkzAN8ISOWwrxmdawuDgTGDDH8";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
