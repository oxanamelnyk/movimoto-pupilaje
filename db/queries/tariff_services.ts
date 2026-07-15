import { db } from "@/db/drizzle";
import { tariffServices } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function getTariffServices() {
  return db
    .select()
    .from(tariffServices)
    .orderBy(desc(tariffServices.updated_at));
}

export async function getTariffServiceById(id: number) {
  const result = await db
    .select()
    .from(tariffServices)
    .where(eq(tariffServices.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getTariffServicesByTariffId(tariffId: number) {
  return db
    .select()
    .from(tariffServices)
    .where(eq(tariffServices.tariff_id, tariffId))
    .orderBy(tariffServices.category, desc(tariffServices.updated_at));
}

export async function getTariffServicesByCategory(
  tariffId: number,
  category: "Delivery" | "Storage",
) {
  return db
    .select()
    .from(tariffServices)
    .where(
      and(
        eq(tariffServices.tariff_id, tariffId),
        eq(tariffServices.category, category),
      ),
    )
    .orderBy(desc(tariffServices.updated_at));
}
