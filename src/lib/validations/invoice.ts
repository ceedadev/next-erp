import * as z from "zod";

export const invoiceSchema = z.object({
  customer: z.number().min(1, "Please select a customer"),
  address: z.number(),
  number: z.string(),
  term: z.string(),
  note: z.string().optional(),
  refNumber: z.string().optional(),
  date: z.date(),
  dueDate: z.date(),
  items: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number(),
        price: z.number(),
        taxRate: z.number(),
      })
    )
    .min(1, "Please add at least one item"),
});
