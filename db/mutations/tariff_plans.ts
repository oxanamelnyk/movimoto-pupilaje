import { db } from "@/db/drizzle";
import { tariffPlans, tariffServices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TariffPlanCreate, TariffPlanUpdate } from "@/validators/tariff_plans";

export async function createTariffPlan(data: TariffPlanCreate) {
  try {
    const result = await db.insert(tariffPlans).values({
      client_id: data.client_id,
      name: data.name,
      valid_from: new Date(data.valid_from),
      valid_to: data.valid_to ? new Date(data.valid_to) : null,
      status: data.status || "Active",
      description: data.description || null,
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
      const tariff = await db
        .select()
        .from(tariffPlans)
        .where(eq(tariffPlans.id, insertedId))
        .limit(1);

      if (tariff[0]) return tariff[0];
    }

    // Fallback: fetch the most recently created tariff for this client
    const fallbackTariff = await db
      .select()
      .from(tariffPlans)
      .where(eq(tariffPlans.client_id, data.client_id))
      .orderBy(desc(tariffPlans.created_at))
      .limit(1);

    return fallbackTariff[0] ?? null;
  } catch (error) {
    console.error("Error creating tariff plan:", error);
    throw error;
  }
}

export async function updateTariffPlan(id: number, data: TariffPlanUpdate) {
  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.valid_from) updateData.valid_from = new Date(data.valid_from);
  if (data.valid_to !== undefined)
    updateData.valid_to = data.valid_to ? new Date(data.valid_to) : null;
  if (data.status) updateData.status = data.status;
  if (data.description !== undefined) updateData.description = data.description;

  if (Object.keys(updateData).length === 0) return null;

  await db.update(tariffPlans).set(updateData).where(eq(tariffPlans.id, id));

  const tariff = await db
    .select()
    .from(tariffPlans)
    .where(eq(tariffPlans.id, id))
    .limit(1);

  return tariff[0] ?? null;
}

export async function deleteTariffPlan(id: number) {
  // First delete all services associated with this tariff
  await db.delete(tariffServices).where(eq(tariffServices.tariff_id, id));
  // Then delete the tariff plan
  await db.delete(tariffPlans).where(eq(tariffPlans.id, id));
}

export async function duplicateTariffPlan(id: number) {
  // Get the original tariff
  const original = await db
    .select()
    .from(tariffPlans)
    .where(eq(tariffPlans.id, id))
    .limit(1);

  if (!original || original.length === 0) return null;

  const tariff = original[0];

  // Create new tariff with "Copy" suffix
  const newName = `${tariff.name} (Copy)`;
  const insertResult = await db.insert(tariffPlans).values({
    client_id: tariff.client_id,
    name: newName,
    valid_from: tariff.valid_from,
    valid_to: tariff.valid_to,
    status: tariff.status,
    description: tariff.description,
  });

  const newTariffId = (insertResult as any).insertId;
  if (!newTariffId) return null;

  // Copy all services from original tariff
  const services = await db
    .select()
    .from(tariffServices)
    .where(eq(tariffServices.tariff_id, id));

  for (const service of services) {
    await db.insert(tariffServices).values({
      tariff_id: newTariffId,
      name: service.name,
      price: service.price,
      unit: service.unit,
      type: service.type as "Fixed" | "Variable",
      discount: service.discount,
      category: service.category as "Delivery" | "Storage",
    });
  }

  const newTariff = await db
    .select()
    .from(tariffPlans)
    .where(eq(tariffPlans.id, newTariffId))
    .limit(1);

  return newTariff[0] ?? null;
}
