/*
  # Initial Schema Setup for Period Tracker

  1. New Tables
    - `periods`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `symptoms` (text[], nullable)
      - `notes` (text, nullable)
      - `flow_level` (int, 1-5)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `periods` table
    - Add policies for CRUD operations
*/

CREATE TABLE periods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    start_date date NOT NULL,
    end_date date,
    symptoms text[],
    notes text,
    flow_level integer CHECK (flow_level BETWEEN 1 AND 5),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE periods ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own period data
CREATE POLICY "Users can view own periods"
    ON periods
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own period data
CREATE POLICY "Users can insert own periods"
    ON periods
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own period data
CREATE POLICY "Users can update own periods"
    ON periods
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own period data
CREATE POLICY "Users can delete own periods"
    ON periods
    FOR DELETE
    USING (auth.uid() = user_id);