import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getClients() {
  return db.select().from(clients).orderBy(clients.fecha_registro);
}

export async function getPupilajeclients() {
  return db
    .select()
    .from(clients)
    .where(eq(clients.es_pupilaje, true))
    .orderBy(clients.fecha_registro);
}

export async function getClientById(id: number) {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.id_cliente, id))
    .limit(1);
  return result[0] || null;
}

export async function getClientByName(name: string) {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.nombre_comercial, name))
    .limit(1);
  return result[0] || null;
}
