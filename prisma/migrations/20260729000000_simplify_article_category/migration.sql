-- Simplify article category: remove direct parent categoryId, make subcategoryId the only category reference
-- Articles now belong only to subcategories; parent category pages aggregate from children.

-- Drop FK constraints (names may vary by Prisma version / provider)
DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Drop FK on old categoryId if it exists
  SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public."Article"'::regclass
      AND conname LIKE '%categoryId%';
  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE "Article" DROP CONSTRAINT %I', constraint_name);
  END IF;

  -- Drop FK on subcategoryId if it exists
  SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public."Article"'::regclass
      AND conname LIKE '%subcategoryId%';
  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE "Article" DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

-- Drop old categoryId column (referenced parent category)
ALTER TABLE "Article" DROP COLUMN IF EXISTS "categoryId";

-- Rename subcategoryId to categoryId (now the only category FK)
ALTER TABLE "Article" RENAME COLUMN "subcategoryId" TO "categoryId";

-- Make categoryId NOT NULL
ALTER TABLE "Article" ALTER COLUMN "categoryId" SET NOT NULL;

-- Add FK constraint
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
