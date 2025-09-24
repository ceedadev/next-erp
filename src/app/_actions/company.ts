"use server";

import { db } from "@/db";
import { tenants } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CreateCompany } from "@/lib/validations/company";

export async function getAllCompanies() {
  const data = await db
    .select()
    .from(tenants)
    .where(eq(tenants.isActive, true))
    .orderBy(asc(tenants.name));

  return data;
}

export async function getCompanyById(id: string) {
  const data = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, id))
    .limit(1);

  return data[0] || null;
}

export async function getCurrentUserCompany() {
  // For now, get the first active company
  // TODO: In a proper multi-tenant setup, this should be based on user's company association
  const data = await db
    .select()
    .from(tenants)
    .where(eq(tenants.isActive, true))
    .limit(1);

  return data[0] || null;
}

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;
  const industry = formData.get("industry") as string;
  const size = formData.get("size") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const postalCode = formData.get("postalCode") as string;
  const logo = formData.get("logo") as string;

  const validatedData = CreateCompany.parse({
    name,
    email,
    phone: phone || undefined,
    website: website || undefined,
    industry: industry || undefined,
    size: size as "small" | "medium" | "large" | "enterprise" | undefined,
    description: description || undefined,
    address: address || undefined,
    city: city || undefined,
    state: state || undefined,
    country: country || undefined,
    postalCode: postalCode || undefined,
    logo: logo || undefined,
  });

  try {
    const result = await db.insert(tenants).values(validatedData).returning();
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/company");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to create company:", error);
    return { success: false, error: "Failed to create company" };
  }
}

export async function updateCompany(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;
  const industry = formData.get("industry") as string;
  const size = formData.get("size") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const postalCode = formData.get("postalCode") as string;
  const logo = formData.get("logo") as string;

  const validatedData = CreateCompany.parse({
    name,
    email,
    phone: phone || undefined,
    website: website || undefined,
    industry: industry || undefined,
    size: size as "small" | "medium" | "large" | "enterprise" | undefined,
    description: description || undefined,
    address: address || undefined,
    city: city || undefined,
    state: state || undefined,
    country: country || undefined,
    postalCode: postalCode || undefined,
    logo: logo || undefined,
  });

  try {
    const result = await db
      .update(tenants)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    
    revalidatePath("/dashboard/company");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to update company:", error);
    return { success: false, error: "Failed to update company" };
  }
}

export async function deleteCompany(id: string) {
  try {
    const result = await db
      .update(tenants)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    
    revalidatePath("/dashboard/company");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to delete company:", error);
    return { success: false, error: "Failed to delete company" };
  }
}