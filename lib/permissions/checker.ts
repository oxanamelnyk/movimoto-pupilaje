import { Action, RoleType } from "@/validators/permissions";
import { PERMISSION_MATRIX } from "./constants";

/**
 * Check if a user role has permission to perform an action
 */
export function hasPermission(role: RoleType | null, action: Action): boolean {
  if (!role) return false;

  const allowedActions = PERMISSION_MATRIX[role];
  return allowedActions?.has(action) ?? false;
}

/**
 * Get all allowed actions for a role
 */
export function getAllowedActions(role: RoleType | null): Action[] {
  if (!role) return [];

  const allowedActions = PERMISSION_MATRIX[role];
  return Array.from(allowedActions ?? new Set());
}

/**
 * Check if user can perform multiple actions
 */
export function hasAllPermissions(
  role: RoleType | null,
  actions: Action[],
): boolean {
  return actions.every((action) => hasPermission(role, action));
}

/**
 * Check if user can perform any of the given actions
 */
export function hasAnyPermission(
  role: RoleType | null,
  actions: Action[],
): boolean {
  return actions.some((action) => hasPermission(role, action));
}
