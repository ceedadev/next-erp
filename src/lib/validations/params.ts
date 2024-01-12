import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional().default("createdAt.desc"),
  search: z.string().optional().nullable(),
});

export const invoiceSearchParamsSchema = searchParamsSchema.extend({
  status: z.enum(["unpaid", "paid", "overdue"]).optional().nullable(),
});
