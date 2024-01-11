import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default("createdAt.desc"),
});

export const invoiceSearchParamsSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  sort: z.string(),
  status: z
    .union([
      z.literal("unpaid"),
      z.literal("paid"),
      z.literal("overdue"),
      z.null(),
    ])
    .optional(),
  search: z.string().nullable().optional(),
  customer: z.string().nullable().optional(), // Add this line
});
