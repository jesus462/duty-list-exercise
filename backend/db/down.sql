DROP TRIGGER IF EXISTS update_duties_updated_at ON duties;

DROP FUNCTION IF EXISTS update_updated_at_column();

DROP INDEX IF EXISTS idx_duties_name;

DROP TABLE IF EXISTS duties;

