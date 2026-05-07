import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getClients() {
  return db.select().from(clients).orderBy(clients.created_at);
}

export async function getClientById(id: string) {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getClientByName(name: string) {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.name, name))
    .limit(1);
  return result[0] || null;
}
