import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tenants } from "@/db/schema";

const insertCompanySchema = createInsertSchema(tenants, {
  name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be at most 255 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(255, "Phone must be at most 255 characters")
    .optional(),
  website: z
    .string()
    .url("Invalid website URL")
    .max(255, "Website must be at most 255 characters")
    .optional()
    .or(z.literal("")),
  industry: z
    .string()
    .max(100, "Industry must be at most 100 characters")
    .optional(),
  size: z
    .enum(["small", "medium", "large", "enterprise"])
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  address: z
    .string()
    .max(500, "Address must be at most 500 characters")
    .optional(),
  city: z
    .string()
    .max(100, "City must be at most 100 characters")
    .optional(),
  state: z
    .string()
    .max(100, "State must be at most 100 characters")
    .optional(),
  country: z
    .string()
    .max(100, "Country must be at most 100 characters")
    .optional(),
  postalCode: z
    .string()
    .max(20, "Postal code must be at most 20 characters")
    .optional(),
  logo: z
    .string()
    .url("Invalid logo URL")
    .max(500, "Logo URL must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

const companySchema = createSelectSchema(tenants);

export { insertCompanySchema as CreateCompany, companySchema };