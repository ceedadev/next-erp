import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { categories } from "@/db/schema";

const insertCategorySchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be at most 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be at most 255 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

const categorySchema = createSelectSchema(categories);

export { insertCategorySchema as CreateCategory, categorySchema };