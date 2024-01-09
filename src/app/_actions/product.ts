"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export async function getAllActiveProducts() {
  const data = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true));
  return data;
}
