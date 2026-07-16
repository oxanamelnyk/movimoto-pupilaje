import { db } from "@/db/drizzle";
import { tariffServices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  TariffServiceCreate,
  TariffServiceUpdate,
} from "@/validators/tariff_services";

export async function createTariffService(data: TariffServiceCreate) {
  try {
    const result = await db.insert(tariffServices).values({
      tariff_id: data.tariff_id,
      name: data.name,
      price: String(data.price || "0.00"),
      unit: data.unit,
      type: data.type || "Fixed",
      discount: data.discount ? String(data.discount) : null,
      category: data.category,
    });

    // Extract inserted ID from result
    let insertedId: number | null = null;

    // Result is [ResultSetHeader, undefined] where ResultSetHeader has insertId
    if (Array.isArray(result) && result[0]?.insertId) {
      insertedId = result[0].insertId;
    } else if ((result as any).insertId) {
      insertedId = (result as any).insertId;
    }

    if (insertedId) {
      const service = await db
        .select()
        .from(tariffServices)
        .where(eq(tariffServices.id, insertedId))
        .limit(1);

      if (service[0]) return service[0];
    }

    // Fallback: fetch the most recently created service for this tariff
    const fallbackService = await db
      .select()
      .from(tariffServices)
      .where(eq(tariffServices.tariff_id, data.tariff_id))
      .orderBy(desc(tariffServices.id))
      .limit(1);

    return fallbackService[0] ?? null;
  } catch (error) {
    console.error("Error creating tariff service:", error);
    throw error;
  }
}

export async function updateTariffService(
  id: number,
  data: TariffServiceUpdate,
) {
  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = String(data.price);
  if (data.unit) updateData.unit = data.unit;
  if (data.type) updateData.type = data.type;
  if (data.discount !== undefined)
    updateData.discount = data.discount ? String(data.discount) : null;
  if (data.category) updateData.category = data.category;

  if (Object.keys(updateData).length === 0) return null;

  await db
    .update(tariffServices)
    .set(updateData)
    .where(eq(tariffServices.id, id));

  const service = await db
    .select()
    .from(tariffServices)
    .where(eq(tariffServices.id, id))
    .limit(1);

  return service[0] ?? null;
}

export async function deleteTariffService(id: number) {
  await db.delete(tariffServices).where(eq(tariffServices.id, id));
}

export async function deleteTariffServicesByTariffId(tariffId: number) {
  await db.delete(tariffServices).where(eq(tariffServices.tariff_id, tariffId));
}
