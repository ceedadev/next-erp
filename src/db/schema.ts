import {
  text,
  serial,
  integer,
  decimal,
  varchar,
  boolean,
  timestamp,
  pgTable,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default(""),
  sku: varchar("sku", { length: 128 }).notNull().default(""),
  slug: varchar("slug", { length: 255 }),
  price: decimal("price").default("0").notNull(),
  quantity: integer("quantity").default(0).notNull(),
  description: text("description").default("").notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isActive: boolean("isActive").default(true).notNull(),
  categoryId: integer("categoryId").references(() => categories.id),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default(""),
  slug: varchar("slug", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// status enum
export const InvoiceStatusEnum = pgEnum("invoiceStatus", [
  "unpaid",
  "paid",
  "overdue",
]);

export const invoices = pgTable("invoices", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  number: varchar("number", { length: 255 }).notNull().default(""),
  date: timestamp("date").defaultNow().notNull(),
  dueDate: timestamp("dueDate").defaultNow().notNull(),
  amount: decimal("amount").default("0").notNull(),
  status: InvoiceStatusEnum("status").default("unpaid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  customer: integer("customer").references(() => customers.id),
  address: integer("address").references(() => addresses.id),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export const invoiceItems = pgTable("invoiceItems", {
  id: serial("id").primaryKey(),
  description: text("description").default("").notNull(),
  quantity: integer("quantity").default(0).notNull(),
  price: decimal("price").default("0").notNull(),
  product: integer("product").references(() => products.id),
  invoiceId: varchar("invoiceId", { length: 128 }).references(
    () => invoices.id
  ),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default(""),
  email: varchar("email", { length: 255 }).notNull().default(""),
  phone: varchar("phone", { length: 255 }).notNull().default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 255 }).notNull().default(""),
  line2: varchar("line2", { length: 255 }).notNull().default(""),
  city: varchar("city", { length: 255 }).notNull().default(""),
  state: varchar("state", { length: 255 }).notNull().default(""),
  postalCode: varchar("postalCode", { length: 255 }).notNull().default(""),
  country: varchar("country", { length: 255 }).notNull().default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

// export const activities = pgTable("activities", {
//   id: serial("id").primaryKey(),
//   description: text("description"),
//   // initiator: integer("initiator").references(() => users.id),
//   timestamp: timestamp("timestamp").defaultNow(),
// });

// export type Activity = typeof activities.$inferSelect;
// export type NewActivity = typeof activities.$inferInsert;
