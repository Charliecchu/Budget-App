import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://lrmmnvdfbyksxauzzeae.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybW1udmRmYnlrc3hhdXp6ZWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0Njk4MDcsImV4cCI6MjAzODA0NTgwN30.7On8JFPqaGPk49F35ppTe349TTGuV5Eal-ykn6qjeP0')