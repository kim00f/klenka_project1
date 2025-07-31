import supabase from '../../../lib/db';

export default async function handler(req, res) {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error });
  res.status(200).json({ message: 'Signed out successfully' });
}
