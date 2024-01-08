DO $$ BEGIN
 CREATE TYPE "invoiceStatus" AS ENUM('unpaid', 'paid', 'overdue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"line1" varchar(255) DEFAULT '' NOT NULL,
	"line2" varchar(255) DEFAULT '' NOT NULL,
	"city" varchar(255) DEFAULT '' NOT NULL,
	"state" varchar(255) DEFAULT '' NOT NULL,
	"postalCode" varchar(255) DEFAULT '' NOT NULL,
	"country" varchar(255) DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"email" varchar(255) DEFAULT '' NOT NULL,
	"phone" varchar(255) DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoiceItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"price" numeric DEFAULT '0' NOT NULL,
	"product" integer,
	"invoiceId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" varchar(255) DEFAULT '' NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp DEFAULT now() NOT NULL,
	"amount" numeric DEFAULT '0' NOT NULL,
	"status" "invoiceStatus" DEFAULT 'unpaid' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"customer" integer,
	"address" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoiceItems" ADD CONSTRAINT "invoiceItems_product_products_id_fk" FOREIGN KEY ("product") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoiceItems" ADD CONSTRAINT "invoiceItems_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_customers_id_fk" FOREIGN KEY ("customer") REFERENCES "customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_address_addresses_id_fk" FOREIGN KEY ("address") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
