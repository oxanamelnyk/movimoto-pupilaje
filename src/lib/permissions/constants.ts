import { Action, Role } from "@/src/validators/permissions";

/**
 * Permission matrix: role -> allowed actions
 * ADMIN: all permissions
 * MANAGER: read, create, update (no delete)
 */
export const PERMISSION_MATRIX: Record<Role, Set<Action>> = {
  [Role.ADMIN]: new Set([Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE]),
  [Role.MANAGER]: new Set([Action.READ, Action.CREATE, Action.UPDATE]),
};

export const DEFAULT_ROLE = Role.MANAGER;
