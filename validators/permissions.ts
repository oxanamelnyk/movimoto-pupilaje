import { z } from "zod";

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
}

export enum Action {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export const roleSchema = z.enum([Role.ADMIN, Role.MANAGER]);

export const permissionCheckSchema = z.object({
  action: z.enum([Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE]),
  role: roleSchema,
});

export type PermissionCheck = z.infer<typeof permissionCheckSchema>;
export type RoleType = z.infer<typeof roleSchema>;
