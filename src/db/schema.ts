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

export const tenants = pgTable("tenant", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }),
  website: varchar("website", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  size: varchar("size", { length: 50 }), // small, medium, large, enterprise
  description: text("description"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  logo: varchar("logo", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

// Better-auth tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: text("role").default("user"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
