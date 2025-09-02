"use server";

import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { CreateProduct, productSchema } from "@/lib/validations/product";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getProductById(id: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return product[0] || null;
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  const validatedData = CreateProduct.parse({
    name,
    price,
    sku,
    description,
    image: image || null,
  });

  try {
    await db
      .update(products)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(products.id, id));
    
    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  try {
    await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));
    
    revalidatePath("/dashboard/products");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product");
  }
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
