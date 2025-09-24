"use server";

import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { asc, desc, eq, like, and, gte, lte, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getInventoryWithPagination(
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  sort: [string, "asc" | "desc"] = ["name", "asc"],
  categoryId?: string,
  lowStock?: boolean
) {
  const offset = (page - 1) * perPage;
  const [column, order] = sort;

  let whereClause = eq(products.isActive, true);

  if (search) {
    whereClause = and(
      whereClause,
      like(products.name, `%${search}%`)
    );
  }

  if (categoryId) {
    whereClause = and(
      whereClause,
      eq(products.categoryId, categoryId)
    );
  }

  if (lowStock) {
    // Consider items with quantity <= 10 as low stock
    whereClause = and(
      whereClause,
      lte(products.quantity, 10)
    );
  }

  const data = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      quantity: products.quantity,
      price: products.price,
      categoryId: products.categoryId,
      categoryName: categories.name,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      isActive: products.isActive,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .orderBy(
      column === "name" 
        ? (order === "asc" ? asc(products.name) : desc(products.name))
        : column === "quantity"
        ? (order === "asc" ? asc(products.quantity) : desc(products.quantity))
        : column === "sku"
        ? (order === "asc" ? asc(products.sku) : desc(products.sku))
        : (order === "asc" ? asc(products.name) : desc(products.name))
    )
    .limit(perPage)
    .offset(offset);

  const totalCount = await db
    .select({ count: count() })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .then((result) => result[0]?.count || 0);

  return {
    data,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
  };
}

export async function updateProductQuantity(productId: string, newQuantity: number, reason: string = "") {
  try {
    const result = await db
      .update(products)
      .set({ 
        quantity: newQuantity, 
        updatedAt: new Date() 
      })
      .where(eq(products.id, productId))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Product not found" };
    }

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/products");
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to update product quantity:", error);
    return { success: false, error: "Failed to update quantity" };
  }
}

export async function adjustInventory(productId: string, adjustment: number, reason: string = "") {
  try {
    // First get current quantity
    const currentProduct = await db
      .select({ quantity: products.quantity, name: products.name })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (currentProduct.length === 0) {
      return { success: false, error: "Product not found" };
    }

    const currentQuantity = currentProduct[0].quantity;
    const newQuantity = Math.max(0, currentQuantity + adjustment);

    const result = await db
      .update(products)
      .set({ 
        quantity: newQuantity, 
        updatedAt: new Date() 
      })
      .where(eq(products.id, productId))
      .returning();

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/products");
    
    return { 
      success: true, 
      data: result[0],
      previousQuantity: currentQuantity,
      newQuantity: newQuantity,
      adjustment: adjustment
    };
  } catch (error) {
    console.error("Failed to adjust inventory:", error);
    return { success: false, error: "Failed to adjust inventory" };
  }
}

export async function bulkUpdateQuantities(updates: { productId: string; quantity: number }[]) {
  try {
    const results = [];
    
    for (const update of updates) {
      const result = await db
        .update(products)
        .set({ 
          quantity: update.quantity, 
          updatedAt: new Date() 
        })
        .where(eq(products.id, update.productId))
        .returning();
      
      results.push(result[0]);
    }

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/products");
    
    return { success: true, data: results };
  } catch (error) {
    console.error("Failed to bulk update quantities:", error);
    return { success: false, error: "Failed to update quantities" };
  }
}

export async function getInventoryStats() {
  try {
    const totalProducts = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true))
      .then((result) => result[0]?.count || 0);

    const lowStock = await db
      .select({ count: count() })
      .from(products)
      .where(and(
        eq(products.isActive, true),
        lte(products.quantity, 10)
      ))
      .then((result) => result[0]?.count || 0);

    const outOfStock = await db
      .select({ count: count() })
      .from(products)
      .where(and(
        eq(products.isActive, true),
        eq(products.quantity, 0)
      ))
      .then((result) => result[0]?.count || 0);

    return {
      totalProducts,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
    };
  } catch (error) {
    console.error("Failed to get inventory stats:", error);
    return {
      totalProducts: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
    };
  }
}