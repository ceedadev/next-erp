ALTER TABLE "categories" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sku" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sku" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;