"use server";

import * as z from "zod";
import { eq, and, lte, gte, desc, sql } from "drizzle-orm";

import { db } from "@/db";
import { customers, invoices } from "@/db/schema";

import { getInvoicesSchema } from "@/lib/validations/invoice";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllInvoices(input: z.infer<typeof getInvoicesSchema>) {
  noStore();
  try {
    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(invoices)
        .limit(input.limit)
        .offset(input.offset)
        .leftJoin(customers, eq(invoices.customer, customers.id))
        .where(
          and(
            input.from ? gte(invoices.date, input.from) : undefined,
            input.to ? lte(invoices.date, input.to) : undefined,
            input.status ? eq(invoices.status, input.status) : undefined
          )
        )
        .orderBy(desc(invoices.date));
      const count = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(invoices)
        .where(
          and(
            input.from ? gte(invoices.date, input.from) : undefined,
            input.to ? lte(invoices.date, input.to) : undefined,
            input.status ? eq(invoices.status, input.status) : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0);

      const pageCount = Math.ceil(count / input.limit);
      return { data, count, pageCount };
    });

    return transaction;
  } catch (error) {
    console.log(error);
    return { data: [], count: 0, pageCount: 0 };
  }
}
