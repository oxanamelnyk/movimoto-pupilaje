import { db } from "../index";
import { platformMemberships } from "@/db/schema/platform_membership";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import type { RoleType } from "@/validators/permissions";

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<RoleType | null> {
  const membership = await db
    .select({
      role: platformMemberships.role,
    })
    .from(platformMemberships)
    .where(eq(platformMemberships.userId, userId))
    .limit(1);

  return (membership[0]?.role as RoleType) || null;
}

/**
 * Check if user has a membership/role
 */
export async function userHasMembership(userId: string): Promise<boolean> {
  const membership = await db
    .select({ id: platformMemberships.id })
    .from(platformMemberships)
    .where(eq(platformMemberships.userId, userId))
    .limit(1);

  return membership.length > 0;
}

/**
 * Get user's membership details
 */
export async function getUserMembership(userId: string) {
  return db
    .select({
      id: platformMemberships.id,
      role: platformMemberships.role,
      createdAt: platformMemberships.createdAt,
    })
    .from(platformMemberships)
    .where(eq(platformMemberships.userId, userId))
    .limit(1);
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(userId: string, role: RoleType) {
  return db
    .insert(platformMemberships)
    .values({
      userId,
      role,
    })
    .onDuplicateKeyUpdate({
      set: {
        role,
        updatedAt: new Date(),
      },
    });
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: RoleType) {
  return db
    .update(platformMemberships)
    .set({ role, updatedAt: new Date() })
    .where(eq(platformMemberships.userId, userId));
}

/**
 * Remove user membership
 */
export async function removeUserMembership(userId: string) {
  return db
    .delete(platformMemberships)
    .where(eq(platformMemberships.userId, userId));
}
