import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xrimomhpknlsmpxxakad.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyaW1vbWhwa25sc21weHhha2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzYxMTgsImV4cCI6MjA2ODg1MjExOH0.OngXsitGh8JJC-IzcC3nDw5JOpFB2kOv5gra3e48Qyc'
);

export default supabase;
