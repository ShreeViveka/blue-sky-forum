import { supabase } from './supabaseClient';

export const api = {
  // --- AUTH OPERATIONS ---
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  uploadFileToStorage: async ({ bucket, path, file, options }) => {
    const uploadOptions = {
      contentType: file?.type || 'application/pdf',
      ...options,
    };
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, uploadOptions);
    if (error) throw error;
    return data;
  },

  getPublicUrl: async ({ bucket, path }) => {
    const { data, error } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    if (error) throw error;
    return data;
  },

  getSignedUrl: async ({ bucket, path, expiresIn = 60 }) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data;
  },

  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  // --- DATABASE OPERATIONS ---

  // Magazines
  getMagazines: async () => {
    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  addMagazine: async (magazineData) => {
    const { data, error } = await supabase
      .from('magazines')
      .insert([magazineData])
      .select();
    if (error) throw error;
    return data;
  },

  deleteMagazine: async (id) => {
    const { error } = await supabase
      .from('magazines')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Words
  getWords: async () => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  addWord: async (wordData) => {
    const { data, error } = await supabase
      .from('words')
      .insert([wordData])
      .select();
    if (error) throw error;
    return data;
  },

  deleteWord: async (id) => {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Contributors
  getContributors: async () => {
    const { data, error } = await supabase
      .from('contributors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  addContributor: async (contributorData) => {
    const { data, error } = await supabase
      .from('contributors')
      .insert([contributorData])
      .select();
    if (error) throw error;
    return data;
  },

  // Feedback
  addFeedback: async (feedbackData) => {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([feedbackData])
      .select();
    if (error) throw error;
    return data;
  },
  getFeedbacks: async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  deleteFeedback: async (id) => {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Thoughts (singleton)
  getThought: async () => {
    const { data, error } = await supabase
      .from('thoughts')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);
    if (error) {
      // If the table doesn't exist yet, return null gracefully
      console.warn('getThought error (possibly missing table):', error.message || error);
      return null;
    }
    return (data && data[0]) || null;
  },

  upsertThought: async (thought) => {
    const payload = {
      id: 'current',
      text: thought.text,
      author: thought.author,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('thoughts')
      .upsert([payload], { returning: 'representation' });
    if (error) {
      console.error('upsertThought error:', error.message || error);
      throw error;
    }
    return data && data[0];
  },

  deleteContributor: async (id) => {
    const { error } = await supabase
      .from('contributors')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};