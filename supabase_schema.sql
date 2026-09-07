-- Create the watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id integer NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title text,
  name text,
  poster_path text,
  backdrop_path text,
  release_date text,
  first_air_date text,
  vote_average numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, media_id, media_type)
);

-- Set up Row Level Security (RLS)
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own watchlists." ON watchlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlists." ON watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlists." ON watchlists
  FOR DELETE USING (auth.uid() = user_id);
