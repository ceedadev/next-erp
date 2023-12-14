import {
  text,
  serial,
  integer,
  decimal,
  varchar,
  boolean,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";

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

// export const activities = pgTable("activities", {
//   id: serial("id").primaryKey(),
//   description: text("description"),
//   // initiator: integer("initiator").references(() => users.id),
//   timestamp: timestamp("timestamp").defaultNow(),
// });

// export type Activity = typeof activities.$inferSelect;
// export type NewActivity = typeof activities.$inferInsert;
