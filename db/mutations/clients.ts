import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ClientCreate, ClientUpdate } from "@/validators/clients";

export async function createClient(data: ClientCreate) {
  const result = await db.insert(clients).values(data);
  const clientId = result.insertId;
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.id_cliente, Number(clientId)))
    .limit(1);
  return client[0] || null;
}

export async function updateClient(id: number, data: ClientUpdate) {
  await db.update(clients).set(data).where(eq(clients.id_cliente, id));
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.id_cliente, id))
    .limit(1);
  return result[0] || null;
}

export async function deleteClient(id: number) {
  await db.delete(clients).where(eq(clients.id_cliente, id));
}
