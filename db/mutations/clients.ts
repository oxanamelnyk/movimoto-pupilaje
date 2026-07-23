import { query, execute } from "@/db";
import { ClientCreate, ClientUpdate } from "@/validators/clients";

export async function createClient(data: ClientCreate) {
  const sql =
    "INSERT INTO clients (name, phone, email, created_at) VALUES (?, ?, ?, NOW())";
  const [result] = await execute(sql, [
    data.name,
    data.phone ?? null,
    data.email ?? null,
  ]);
  const clientId = (result as { insertId: number }).insertId;

  if (!clientId) return null;

  const client = await query("SELECT * FROM clients WHERE id = ?", [clientId]);
  return client[0] || null;
}

export async function updateClient(id: number, data: ClientUpdate) {
  const fields = [];
  const values: (string | number | null)[] = [];

  if (data.name) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.phone) {
    fields.push("phone = ?");
    values.push(data.phone);
  }
  if (data.email) {
    fields.push("email = ?");
    values.push(data.email);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const sql = `UPDATE clients SET ${fields.join(", ")} WHERE id = ?`;
  await execute(sql, values);

  const client = await query("SELECT * FROM clients WHERE id = ?", [id]);
  return client[0] || null;
}

export async function deleteClient(id: number) {
  await execute("DELETE FROM clients WHERE id = ?", [id]);
}
