const SUPABASE_URL = "https://ddxurmzmepkbgulbawiw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bUEJIkNgtNfwt6j-xdmThg_3ZFTXj-H";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);