ALTER TABLE "customers" ADD COLUMN "addresses" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_addresses_addresses_id_fk" FOREIGN KEY ("addresses") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
