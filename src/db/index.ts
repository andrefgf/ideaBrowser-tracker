import { createClient } from '@supabase/supabase-js';

export async function storeSnapshot(data: {
  url: string;
  content: string;
  screenshot_data: Buffer;
}) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.log('Supabase credentials missing. Skipping database storage.');
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const { error } = await supabase
    .from('idea_snapshots')
    .insert([
      {
        url: data.url,
        content: data.content,
        screenshot_data: data.screenshot_data
      }
    ]);

  if (error) throw error;
  return true;
}
