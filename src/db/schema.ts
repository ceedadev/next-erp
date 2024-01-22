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
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
// import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
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
  categoryId: uuid("categoryId").references(() => categories.id),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
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
  id: uuid("id").defaultRandom().primaryKey(),
  number: varchar("number", { length: 255 }).notNull().default(""),
  date: timestamp("date").defaultNow().notNull(),
  dueDate: timestamp("dueDate").defaultNow().notNull(),
  amount: decimal("amount").default("0").notNull(),
  status: InvoiceStatusEnum("status").default("unpaid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  customer: uuid("customer").references(() => customers.id),
  address: uuid("address").references(() => addresses.id),
  note: text("note").default(""),
  reference: varchar("reference", { length: 255 }).default(""),
});

export const invoiceRelations = relations(invoices, ({ many, one }) => ({
  items: many(invoiceItems),
  customer: one(customers, {
    fields: [invoices.customer],
    references: [customers.id],
  }),
}));

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export const invoiceItems = pgTable("invoiceItems", {
  id: uuid("id").defaultRandom().primaryKey(),
  description: text("description").default("").notNull(),
  quantity: integer("quantity").default(0).notNull(),
  price: decimal("price").default("0").notNull(),
  product: uuid("product").references(() => products.id),
  invoiceId: uuid("invoiceId").references(() => invoices.id),
});

export const invoiceItemRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.product],
    references: [products.id],
  }),
}));

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default(""),
  email: varchar("email", { length: 255 }).notNull().default(""),
  phone: varchar("phone", { length: 255 }).notNull().default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isActive: boolean("isActive").default(true).notNull(),
  addresses: uuid("addresses").references(() => addresses.id),
});

export const customerRelations = relations(customers, ({ many }) => ({
  // addresses: many(addresses),
  invoices: many(invoices),
}));

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
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
