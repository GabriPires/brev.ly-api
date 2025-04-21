CREATE TABLE "link" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "link_short_url_unique" UNIQUE("short_url")
);
