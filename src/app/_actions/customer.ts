"use server";

import { db } from "@/db";
import { addresses, customers } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateCustomer } from "@/lib/validations/customer";

export async function getAllCustomers() {
  const data = await db
    .select()
    .from(customers)
    .where(eq(customers.isActive, true))
    .orderBy(asc(customers.name));

  return data;
}

export async function getCustomerById(id: string) {
  const data = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  return data[0] || null;
}

export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  const validatedData = CreateCustomer.parse({
    name,
    email,
    phone,
  });

  try {
    await db.insert(customers).values(validatedData);
    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
  } catch (error) {
    console.error("Failed to create customer:", error);
    throw new Error("Failed to create customer");
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  const validatedData = CreateCustomer.parse({
    name,
    email,
    phone,
  });

  try {
    await db
      .update(customers)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(customers.id, id));
    
    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw new Error("Failed to update customer");
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db
      .update(customers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(customers.id, id));
    
    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw new Error("Failed to delete customer");
  }
}
