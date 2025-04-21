ALTER TABLE "link" DROP CONSTRAINT "link_short_url_unique";--> statement-breakpoint
ALTER TABLE "link" ADD COLUMN "short_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "link" DROP COLUMN "short_url";--> statement-breakpoint
ALTER TABLE "link" ADD CONSTRAINT "link_short_hash_unique" UNIQUE("short_hash");