ALTER TABLE "lists" ADD COLUMN "public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "lists_public_idx" ON "lists" USING btree ("public");