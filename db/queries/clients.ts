import { query } from "@/db";

export async function getClients() {
  return query("SELECT * FROM clients ORDER BY created_at DESC");
}

export async function getPupilajeclients() {
  return query("SELECT * FROM clients ORDER BY created_at DESC");
}

export async function getClientById(id: number) {
  const result = await query("SELECT * FROM clients WHERE id = ? LIMIT 1", [id]);
  return result[0] || null;
}

export async function getClientByName(name: string) {
  const result = await query("SELECT * FROM clients WHERE name = ? LIMIT 1", [name]);
  return result[0] || null;
}
