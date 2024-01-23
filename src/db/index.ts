// USING POSTGRES (LOCAL) / HOSTED
// -- START
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const connectionString = process.env.DATABASE_URL as string;
// const client = postgres(connectionString, { prepare: false });

// export const db = drizzle(client, { schema });
// -- END

// USING NEON (SERVERLESS)
// -- START
import * as schema from "./schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
