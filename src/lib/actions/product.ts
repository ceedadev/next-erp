"use server";

import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { CreateProduct, productSchema } from "@/lib/validations/product";
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

  revalidatePath("/dashboard/products");
}

export async function insertProduct(input: z.infer<typeof CreateProduct>) {
  // Check name if exist
  const productNameExist = await db.query.products.findFirst({
    columns: { id: true },
    where: eq(products.name, input.name!),
  });
  if (productNameExist) {
    throw new Error("Product name already exist");
  }
  await db.insert(products).values({
    ...input,
  });
  revalidatePath("/dashboard/products");
}
