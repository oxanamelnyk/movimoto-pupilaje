import { query, execute } from "../index";
import type { RoleType } from "@/validators/permissions";

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<RoleType | null> {
  const result = await query("SELECT role FROM platform_membership WHERE userId = ? LIMIT 1", [userId]);
  return (result[0]?.role as RoleType) || null;
}

/**
 * Check if user has a membership/role
 */
export async function userHasMembership(userId: string): Promise<boolean> {
  const result = await query("SELECT id FROM platform_membership WHERE userId = ? LIMIT 1", [userId]);
  return result.length > 0;
}

/**
 * Get user's membership details
 */
export async function getUserMembership(userId: string) {
  const result = await query("SELECT id, role, createdAt FROM platform_membership WHERE userId = ? LIMIT 1", [userId]);
  return result;
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(userId: string, role: RoleType) {
  const sql = `
    INSERT INTO platform_membership (userId, role, createdAt, updatedAt)
    VALUES (?, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
    role = ?, updatedAt = NOW()
  `;
  return execute(sql, [userId, role, role]);
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: RoleType) {
  const sql = "UPDATE platform_membership SET role = ?, updatedAt = NOW() WHERE userId = ?";
  return execute(sql, [role, userId]);
}

/**
 * Remove user membership
 */
export async function removeUserMembership(userId: string) {
  return execute("DELETE FROM platform_membership WHERE userId = ?", [userId]);
}
