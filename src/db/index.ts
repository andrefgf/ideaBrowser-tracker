import { createClient } from '@supabase/supabase-js';

type SnapshotData = {
  source_url: string;
  content: string;
  captured_at: string;
};

export async function storeSnapshot(data: SnapshotData) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('Supabase credentials missing. Skipping database storage.');
    return false;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  try {
    const { error } = await supabase
      .from('captured_ideas')
      .insert([
        {
          source_url: data.source_url,
          content: data.content,
          captured_at: data.captured_at
        }
      ]);

    if (error) {
      // Handle potential undefined error message
      const errorMessage = error.message || JSON.stringify(error);
      console.error('Supabase storage error:', errorMessage);
      return false;
    }
    
    console.log('Snapshot stored successfully');
    return true;
  } catch (e) {
    // Handle unexpected errors
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('Unexpected error in storeSnapshot:', errorMessage);
    return false;
  }
}

export async function testSupabaseConnection() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );
  
  const { data, error } = await supabase
    .from('captured_ideas')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Supabase connection test failed:', error);
  } else {
    console.log('Supabase connection successful. Found', data?.length, 'records');
  }
}