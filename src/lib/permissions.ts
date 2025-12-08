import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const schedule = {
  schedule: ["read", "list", "create", "update", "delete", "requestUpdate"],
} as const;

export const spreadsheet = {
  spreadsheet: ["read", "list", "create", "update", "edit", "delete"],
} as const;

export const permissions = {
  ...defaultStatements,
  ...schedule,
  ...spreadsheet,
} as const;

export const ac = createAccessControl(permissions);

export const user = ac.newRole({
  schedule: ["read", "list", "requestUpdate"],
  spreadsheet: ["read", "list", "edit"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  schedule: ["read", "list", "create", "update", "delete", "requestUpdate"],
  spreadsheet: ["read", "list", "create", "update", "edit", "delete"],
});

export const supervisor = ac.newRole({
  schedule: ["read", "list", "create", "update", "delete", "requestUpdate"],
  spreadsheet: ["read", "list", "create", "update", "edit", "delete"],
});
