import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { products } from "@/db/schema";

const insertProductSchema = createInsertSchema(products, {
  id: z.number().int().positive(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters long"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(128, "SKU must be at most 128 characters long"),
  description: z.string().min(1, "Description is required"),
});

const productSchema = createSelectSchema(products);

export { insertProductSchema as CreateProduct, productSchema };
