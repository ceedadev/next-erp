"use server";

import { db } from "@/db";
import { customers, invoices, products } from "@/db/schema";
import { sql, eq, sum, count } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    // Get total sales from paid invoices
    const totalSalesResult = await db
      .select({ 
        total: sum(invoices.amount) 
      })
      .from(invoices)
      .where(eq(invoices.status, "paid"));

    // Get total inventory value (sum of product price * quantity)
    const totalInventoryResult = await db
      .select({
        total: sql<number>`sum(${products.price}::numeric * ${products.quantity})`
      })
      .from(products)
      .where(eq(products.isActive, true));

    // Get total customers count
    const totalCustomersResult = await db
      .select({ 
        count: count() 
      })
      .from(customers)
      .where(eq(customers.isActive, true));

    // Get total products count
    const totalProductsResult = await db
      .select({ 
        count: count() 
      })
      .from(products)
      .where(eq(products.isActive, true));

    // Get recent invoices for activities
    const recentInvoices = await db
      .select({
        id: invoices.id,
        number: invoices.number,
        amount: invoices.amount,
        status: invoices.status,
        date: invoices.date,
        customerName: customers.name
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customer, customers.id))
      .orderBy(sql`${invoices.createdAt} DESC`)
      .limit(5);

    return {
      totalSales: totalSalesResult[0]?.total || "0",
      totalInventory: totalInventoryResult[0]?.total || 0,
      totalCustomers: totalCustomersResult[0]?.count || 0,
      totalProducts: totalProductsResult[0]?.count || 0,
      recentActivities: recentInvoices.map(invoice => ({
        message: `Invoice ${invoice.number} ${invoice.status} - ${invoice.customerName || 'Unknown Customer'}`,
        timestamp: invoice.date,
        amount: invoice.amount
      }))
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalSales: "0",
      totalInventory: 0,
      totalCustomers: 0,
      totalProducts: 0,
      recentActivities: []
    };
  }
}