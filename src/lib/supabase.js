import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database schema helper functions
export const createUserProfile = async (userId, email) => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        user_id: userId,
        email: email,
        subscription_status: 'free',
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data[0];
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
};

export const updateSubscriptionStatus = async (userId, status) => {
  const { data, error } = await supabase
    .from('users')
    .update({ subscription_status: status })
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }

  return data[0];
};

export const saveDocument = async (userId, type, content) => {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        user_id: userId,
        type: type,
        content: content,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('Error saving document:', error);
    throw error;
  }

  return data[0];
};

export const saveScanResult = async (userId, documentId, jobDescriptionId, results) => {
  const { data, error } = await supabase
    .from('scan_results')
    .insert([
      {
        user_id: userId,
        document_id: documentId,
        job_description_id: jobDescriptionId,
        optimization_suggestions: results.keywordAnalysis,
        skills_gap_analysis: results.skillsGap,
        rewritten_content: results.rewrittenContent,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }

  return data[0];
};

export const getUserScanResults = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('scan_results')
    .select(`
      *,
      documents!inner(type, content),
      job_descriptions!inner(content)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching scan results:', error);
    throw error;
  }

  return data;
};
