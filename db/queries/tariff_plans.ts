import { db } from "@/db/drizzle";
import { tariffPlans } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getTariffPlans() {
  return db.select().from(tariffPlans).orderBy(desc(tariffPlans.updated_at));
}

export async function getTariffPlanById(id: number) {
  const result = await db
    .select()
    .from(tariffPlans)
    .where(eq(tariffPlans.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getTariffPlansByClientId(clientId: number) {
  return db
    .select()
    .from(tariffPlans)
    .where(eq(tariffPlans.client_id, clientId))
    .orderBy(desc(tariffPlans.updated_at));
}

export async function getTariffPlansByStatus(status: "Active" | "Archived") {
  return db
    .select()
    .from(tariffPlans)
    .where(eq(tariffPlans.status, status))
    .orderBy(desc(tariffPlans.updated_at));
}
