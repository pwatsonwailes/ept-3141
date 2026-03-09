-- Add Emotions and Ovulation Tracking
--
-- 1. New Tables
--    - emotions: Track daily emotional states using PANAS scale
--    - ovulation_logs: Track ovulation indicators (BBT, cervical mucus, tests)
--
-- 2. Security
--    - Enable RLS on both tables
--    - Users can only access their own data
--
-- 3. Notes
--    - PANAS emotions: interested, excited, strong, enthusiastic, proud,
--      alert, inspired, determined, attentive, active (positive) and
--      distressed, upset, guilty, scared, hostile, irritable, ashamed,
--      nervous, jittery, afraid (negative)
--    - Ovulation tracking uses symptothermal method

CREATE TABLE IF NOT EXISTS emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  emotion_type text NOT NULL,
  intensity integer NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ovulation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  basal_temp decimal(4,2),
  cervical_mucus text CHECK (cervical_mucus IN ('dry', 'sticky', 'creamy', 'watery', 'egg-white', '')),
  ovulation_test text CHECK (ovulation_test IN ('negative', 'positive', '')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emotions_user_date_idx ON emotions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS ovulation_logs_user_date_idx ON ovulation_logs(user_id, date DESC);

ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ovulation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotions"
  ON emotions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotions"
  ON emotions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotions"
  ON emotions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotions"
  ON emotions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ovulation logs"
  ON ovulation_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ovulation logs"
  ON ovulation_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ovulation logs"
  ON ovulation_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ovulation logs"
  ON ovulation_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);