"use server";

import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { productSchema } from "@/lib/validations/product";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProduct(input: z.infer<typeof productSchema>) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, input.id),
  });

  if (!product) {
    throw new Error("Product not found");
  }

  revalidatePath("/products");
}
