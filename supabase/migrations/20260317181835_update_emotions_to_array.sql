/*
  # Update emotions table to support multiple emotions per entry

  1. Changes
    - Change emotion_type from single text to array of text values
    - Remove intensity field as it's no longer needed
    - Simplify to track multiple emotions with notes per day

  2. Notes
    - New emotions: Neutral, Anxious, Severe anxiety, Insomnia, Intrusive thoughts, Sad/crying, Irritable, Happy, Fatigue
    - Users can now select multiple emotions in a single entry
    - Data migration: existing emotion entries will be converted to arrays
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emotions' AND column_name = 'intensity'
  ) THEN
    ALTER TABLE emotions DROP COLUMN intensity;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emotions' AND column_name = 'emotion_type'
  ) THEN
    ALTER TABLE emotions RENAME COLUMN emotion_type TO emotion_types;
    ALTER TABLE emotions ALTER COLUMN emotion_types TYPE text[] USING ARRAY[emotion_types];
  END IF;
END $$;
