"use server";

import * as z from "zod";
import { eq, and, lte, gte, desc, sql, asc, or, ilike } from "drizzle-orm";

import { db } from "@/db";
import { Invoice, customers, invoices } from "@/db/schema";

import { getInvoicesSchema } from "@/lib/validations/invoice";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllInvoices(input: z.infer<typeof getInvoicesSchema>) {
  noStore();
  try {
    const [column, order] = (input.sort?.split(".") as [
      keyof Invoice | undefined,
      "asc" | "desc" | undefined
    ]) ?? ["createdAt", "desc"];

    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(invoices)
        .limit(input.limit)
        .offset(input.offset)
        .leftJoin(customers, eq(invoices.customer, customers.id))
        .where(
          and(
            // filter by customer name
            input.search
              ? ilike(customers.name, `%${input.search}%`)
              : undefined,
            // filter by status
            input.status ? eq(invoices.status, input.status) : undefined,
            // filter by invoice date
            input.fromDay && input.toDay
              ? and(
                  gte(invoices.date, input.fromDay),
                  lte(invoices.date, input.toDay)
                )
              : undefined
          )
        )
        .orderBy(
          column && column in invoices
            ? order === "asc"
              ? asc(invoices[column])
              : desc(invoices[column])
            : desc(invoices.createdAt)
        );

      const count = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(invoices)
        .where(
          and(
            // filter by customer name
            input.search
              ? ilike(customers.name, `%${input.search}%`)
              : undefined,
            // filter by status
            input.status ? eq(invoices.status, input.status) : undefined,
            // filter by invoice date
            input.fromDay && input.toDay
              ? and(
                  gte(invoices.date, input.fromDay),
                  lte(invoices.date, input.toDay)
                )
              : undefined
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
