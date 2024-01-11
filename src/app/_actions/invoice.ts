"use server";

import * as z from "zod";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { invoiceItems, invoices, products } from "@/db/schema";
import { invoiceSchema } from "@/lib/validations/invoice";
import { redirect } from "next/navigation";

export async function getLatestInvoiceNumber() {
  const lastInvoice = await db.query.invoices.findFirst({
    orderBy: desc(invoices.createdAt),
    columns: {
      number: true,
    },
  });
  // number format "1234"
  const newInvoiceNumber = Number(lastInvoice?.number) + 1;

  console.log(`lastInvoiceNumber: ${JSON.stringify(lastInvoice)}`);
  console.log(`newInvoiceNumber: ${newInvoiceNumber}`);
  return newInvoiceNumber.toString();
}

export async function createInvoice(values: z.infer<typeof invoiceSchema>) {
  // calculate invoice amount from every item, don't forget to add tax
  let amount = 0;
  let tax = 0; // TODO: tax amount is not inserted to db yet, edit schema first
  let total = 0;
  for (const item of values.items) {
    amount += item.price * item.quantity;
    tax += item.price * item.quantity * (item.taxRate / 100);
  }
  total = amount + tax;

  try {
    await db.transaction(async (tx) => {
      // create invoice
      const newInvoice = await tx
        .insert(invoices)
        .values({
          number: values.number,
          date: values.date,
          dueDate: values.dueDate,
          status: "unpaid",
          customer: values.customer,
          amount: total.toString(), //TODO: edit naming to match schema
        })
        .returning({ id: invoices.id });

      // create invoice items, with invoice id from newInvoice
      await tx.insert(invoiceItems).values(
        values.items.map((item) => ({
          invoiceId: newInvoice[0].id,
          product: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
        }))
      );

      // TODO: update product stock here
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("invoice created");
    console.log(values);
    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
  }
}

export async function getPaymentTerms() {
  const data = [
    { value: "cod", name: "Cash On Delivery", day: 0 },
    { value: "cbd", name: "Cash Before Delivery", day: 0 },
    { value: "net7", name: "Net 7 Days", day: 7 },
    { value: "net14", name: "Net 14 Days", day: 14 },
    { value: "net30", name: "Net 30 Days", day: 30 },
  ];
  return data;
}

export async function getDeliveryMethods() {
  const data = [
    { value: "courier", name: "Courier" },
    { value: "pickup", name: "Pickup" },
  ];
  return data;
}
