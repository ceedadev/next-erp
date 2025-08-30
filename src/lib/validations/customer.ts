import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { customers } from "@/db/schema";

const insertCustomerSchema = createInsertSchema(customers, {
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters long"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters long"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(255, "Phone must be at most 255 characters long"),
});

const customerSchema = createSelectSchema(customers);

export { insertCustomerSchema as CreateCustomer, customerSchema };