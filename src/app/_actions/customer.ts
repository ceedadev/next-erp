"use server";

import { db } from "@/db";
import { addresses, customers } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function getAllCustomers() {
  const data = await db.query.customers.findMany({
    columns: { id: true, name: true },
  });

  return data;
}

// export async function getAddressesByCustomerId(id:number){
//     const data = await db.select().from(addresses).where({})
// }
