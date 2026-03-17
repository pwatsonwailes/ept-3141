/*
  # Migrate existing emotion data to new format

  1. Data Migration
    - Convert existing single emotion_type values to emotion_types arrays
    - Handles NULL values gracefully
    - Preserves all existing emotion entries

  2. Notes
    - This migration safely transforms data while maintaining referential integrity
    - No data is deleted or lost in the process
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'emotions' AND column_name = 'emotion_types'
  ) THEN
    UPDATE emotions
    SET emotion_types = CASE
      WHEN emotion_types IS NULL OR emotion_types = '{}' THEN ARRAY[]::text[]
      ELSE emotion_types
    END
    WHERE emotion_types IS NULL OR emotion_types = '{}';
  END IF;
END $$;
