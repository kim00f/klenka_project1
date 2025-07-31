import supabase from '../../../lib/db';

export default async function handler(req, res) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) return res.status(400).json({ error });
  res.status(200).json(data);
}
