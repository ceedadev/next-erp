"use server";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export async function getAllActiveProducts() {
  const data = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sku));
  return data;
}
