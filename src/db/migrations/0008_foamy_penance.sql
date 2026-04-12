ALTER TABLE "participations" DROP CONSTRAINT "participations_source_list_id_lists_id_fk";
--> statement-breakpoint
ALTER TABLE "participations" ALTER COLUMN "source_list_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "participations" ADD CONSTRAINT "participations_source_list_id_lists_id_fk" FOREIGN KEY ("source_list_id") REFERENCES "public"."lists"("id") ON DELETE set null ON UPDATE no action;