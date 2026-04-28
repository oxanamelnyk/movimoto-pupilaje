import { Action, RoleType } from "@/src/validators/permissions";
import { hasPermission } from "./checker";

export class PermissionDeniedError extends Error {
  constructor(
    message: string = "Permission denied",
    public action?: Action,
    public role?: RoleType,
  ) {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

/**
 * Assert user has permission, throw error if not
 */
export function assertPermission(
  role: RoleType | null,
  action: Action,
): asserts role is RoleType {
  if (!hasPermission(role, action)) {
    throw new PermissionDeniedError(
      `User does not have permission to ${action}`,
      action,
      role ?? undefined,
    );
  }
}
