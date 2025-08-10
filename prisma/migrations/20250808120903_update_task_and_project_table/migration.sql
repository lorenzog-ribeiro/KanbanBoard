/*
  Warnings:

  - Added the required column `description` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."priority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "public"."task_status" AS ENUM ('todo', 'in_progress', 'done');

-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "priority" "public"."priority",
ADD COLUMN     "status" "public"."task_status";
