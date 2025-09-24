"use server";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, desc, eq, like, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CreateCategory } from "@/lib/validations/category";

export async function getAllCategories() {
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      isActive: categories.isActive,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .where(eq(categories.isActive, true))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));

  return data;
}

export async function getCategoriesWithPagination(
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  sort: [string, "asc" | "desc"] = ["name", "asc"]
) {
  const offset = (page - 1) * perPage;
  const [column, order] = sort;

  const whereClause = search
    ? like(categories.name, `%${search}%`)
    : eq(categories.isActive, true);

  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      isActive: categories.isActive,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .where(whereClause)
    .groupBy(categories.id)
    .orderBy(order === "asc" ? asc(categories.name) : desc(categories.name))
    .limit(perPage)
    .offset(offset);

  const totalCount = await db
    .select({ count: count() })
    .from(categories)
    .where(whereClause)
    .then((result) => result[0]?.count || 0);

  return {
    data,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
  };
}

export async function getCategoryById(id: string) {
  const data = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return data[0] || null;
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;

  const validatedData = CreateCategory.parse({
    name,
    description: description || undefined,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
  });

  try {
    const result = await db.insert(categories).values(validatedData).returning();
    revalidatePath("/dashboard/categories");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;

  const validatedData = CreateCategory.parse({
    name,
    description: description || undefined,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
  });

  try {
    const result = await db
      .update(categories)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/dashboard/categories");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const result = await db
      .update(categories)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/dashboard/categories");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  try {
    const result = await db
      .update(categories)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/dashboard/categories");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to toggle category status:", error);
    return { success: false, error: "Failed to toggle category status" };
  }
}