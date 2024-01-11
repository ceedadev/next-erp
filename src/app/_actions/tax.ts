"use server";

import * as z from "zod";

const taxSchema = z.object({
  id: z.number(),
  name: z.string(),
  rate: z.number(),
});

export type Tax = z.infer<typeof taxSchema>;

export async function getTaxes() {
  const tax = [
    {
      id: 0,
      name: "No Tax",
      rate: 0,
    },
    {
      id: 1,
      name: "PPN 10%",
      rate: 10,
    },
  ] as z.infer<typeof taxSchema>[];
  return tax;
}
