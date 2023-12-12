CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"isActive" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"price" numeric,
	"quantity" integer DEFAULT 0,
	"description" text,
	"image" varchar(255),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"isActive" boolean DEFAULT true,
	"categoryId" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
