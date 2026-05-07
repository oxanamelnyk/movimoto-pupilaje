import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

// Handle case where DATABASE_URL might not be available during build
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL not found, some features may not work");
}

export const db = drizzle(dbUrl || "mysql://localhost/placeholder");

export * from "./schema";
