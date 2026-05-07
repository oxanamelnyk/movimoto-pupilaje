import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ClientCreate, ClientUpdate } from "@/validators/clients";

export async function createClient(data: ClientCreate) {
  const id = crypto.randomUUID();
  const client = {
    id,
    ...data,
    created_at: new Date(),
  };
  await db.insert(clients).values(client);
  return client;
}

export async function updateClient(id: string, data: ClientUpdate) {
  await db.update(clients).set(data).where(eq(clients.id, id));
  // Fetch the updated client
  const result = await db.select().from(clients).where(eq(clients.id, id));
  return result[0] || null;
}

export async function deleteClient(id: string) {
  await db.delete(clients).where(eq(clients.id, id));
}
