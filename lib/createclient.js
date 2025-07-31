import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvnbtyaenzqavgiklyul.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bmJ0eWFlbnpxYXZnaWtseXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTg1NzksImV4cCI6MjA2OTI3NDU3OX0.NYCPXQLk5ua_FcXT2mZoI7pNZJHkIHeEGiKwb0qQ9eY'
);

export default supabase;
