import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ClientCreate, ClientUpdate } from "@/validators/clients";

export async function createClient(data: ClientCreate) {
  const id = crypto.randomUUID();
  const result = await db
    .insert(clients)
    .values({
      id,
      ...data,
    })
    .returning();
  return result[0];
}

export async function updateClient(id: string, data: ClientUpdate) {
  const result = await db
    .update(clients)
    .set(data)
    .where(eq(clients.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteClient(id: string) {
  await db.delete(clients).where(eq(clients.id, id));
}
