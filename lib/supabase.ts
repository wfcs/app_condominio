
import { createClient } from '@supabase/supabase-js';

// Credenciais configuradas para o projeto ulvrwjkneomwwsvurxdf
const SUPABASE_URL = 'https://ulvrwjkneomwwsvurxdf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdnJ3amtuZW9td3dzdnVyeGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MDY4NjMsImV4cCI6MjA4MzQ4Mjg2M30.jntu9YLXfUVTiQIcDRhmaLbnF66oBjwqeLSk4DODjj8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
