"use server";

import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { productSchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProduct(input: z.infer<typeof productSchema>) {
  const product = await db.query.products.findFirst({});

  //   await db.update(products).set(input).where();

  revalidatePath("/products");
}
