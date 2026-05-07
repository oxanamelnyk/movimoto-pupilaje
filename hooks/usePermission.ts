"use client";

import { useMemo } from "react";
import { Action, RoleType } from "../validators/permissions";
import {
  getAllowedActions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "../db/lib/permissions/checker";

interface UsePermissionProps {
  role: RoleType | null;
}

/**
 * Client-side hook to check permissions
 * Use for UI state only - always verify on server
 */
export function usePermission({ role }: UsePermissionProps) {
  return useMemo(
    () => ({
      can: (action: Action) => hasPermission(role, action),
      canAll: (actions: Action[]) => hasAllPermissions(role, actions),
      canAny: (actions: Action[]) => hasAnyPermission(role, actions),
      allowed: getAllowedActions(role),
    }),
    [role],
  );
}

/**
 * Helper hook to check read permission
 */
export function useCanRead(role: RoleType | null) {
  return hasPermission(role, Action.READ);
}

/**
 * Helper hook to check create permission
 */
export function useCanCreate(role: RoleType | null) {
  return hasPermission(role, Action.CREATE);
}

/**
 * Helper hook to check update permission
 */
export function useCanUpdate(role: RoleType | null) {
  return hasPermission(role, Action.UPDATE);
}

/**
 * Helper hook to check delete permission
 */
export function useCanDelete(role: RoleType | null) {
  return hasPermission(role, Action.DELETE);
}
