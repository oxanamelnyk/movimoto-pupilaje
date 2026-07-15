import { db } from "@/db/drizzle";
import { tariffServices } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  TariffServiceCreate,
  TariffServiceUpdate,
} from "@/validators/tariff_services";

export async function createTariffService(data: TariffServiceCreate) {
  const result = await db.insert(tariffServices).values({
    tariff_id: data.tariff_id,
    name: data.name,
    price: String(data.price || "0.00"),
    unit: data.unit,
    type: data.type || "Fixed",
    discount: data.discount ? String(data.discount) : null,
    category: data.category,
  });

  if (!result) return null;

  const service = await db
    .select()
    .from(tariffServices)
    .where(eq(tariffServices.id, result[0]))
    .limit(1);

  return service[0] ?? null;
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
