ALTER TABLE "lists" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_slug_unique" UNIQUE("slug");