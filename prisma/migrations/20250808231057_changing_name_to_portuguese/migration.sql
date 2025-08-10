/*
  Warnings:

  - The values [low,medium,high] on the enum `priority` will be removed. If these variants are still used in the database, this will fail.
  - The values [todo,in_progress,done] on the enum `task_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."priority_new" AS ENUM ('baixa', 'media', 'alta');
ALTER TABLE "public"."tasks" ALTER COLUMN "priority" TYPE "public"."priority_new" USING ("priority"::text::"public"."priority_new");
ALTER TYPE "public"."priority" RENAME TO "priority_old";
ALTER TYPE "public"."priority_new" RENAME TO "priority";
DROP TYPE "public"."priority_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."task_status_new" AS ENUM ('a_fazer', 'em_progresso', 'concluido');
ALTER TABLE "public"."tasks" ALTER COLUMN "status" TYPE "public"."task_status_new" USING ("status"::text::"public"."task_status_new");
ALTER TYPE "public"."task_status" RENAME TO "task_status_old";
ALTER TYPE "public"."task_status_new" RENAME TO "task_status";
DROP TYPE "public"."task_status_old";
COMMIT;
