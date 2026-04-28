"use server";

import { getUserRole } from "@/src/db/queries/permissions";
import { assertPermission } from "@/src/lib/permissions/middleware";
import { Action } from "@/src/validators/permissions";

export interface InvoiceUpdateData {
  amount?: number;
  status?: string;
  description?: string;
  // Add other invoice fields as needed
}

/**
 * Example server action showing permission checking
 * Usage: await deleteInvoice({ invoiceId: 1, userId: "user-id" })
 */
export async function deleteInvoice({
  invoiceId,
  userId,
}: {
  invoiceId: number;
  userId: string;
}) {
  // Get user role
  const role = await getUserRole(userId);

  // Check delete permission - will throw if not allowed
  assertPermission(role, Action.DELETE);

  // TODO: Implement actual deletion logic
  console.log(`Deleting invoice ${invoiceId}`);

  return { success: true };
}

/**
 * Example server action with conditional logic
 */
export async function updateInvoice({
  invoiceId,
  data,
  userId,
}: {
  invoiceId: number;
  data: InvoiceUpdateData;
  userId: string;
}) {
  const role = await getUserRole(userId);

  // Check update permission
  assertPermission(role, Action.UPDATE);

  // TODO: Implement actual update logic
  console.log(`Updating invoice ${invoiceId}`, data);

  return { success: true };
}
