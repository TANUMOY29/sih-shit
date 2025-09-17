import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfznswfpyqafxceppfoz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmem5zd2ZweXFhZnhjZXBwZm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTM3NDgsImV4cCI6MjA3MzQyOTc0OH0.Lkl8gtRxJh1No5DnQyVu0V81V8S7-FrnjkHtkb-iCcw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);