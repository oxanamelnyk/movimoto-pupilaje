Pattern We Followed
1. Use existing UI patterns (Drawer, not Dialog)

Like AddVehicleDrawer which slides from right

Consistent with codebase conventions
2. Re-export types centrally (avoid duplication)

Types defined in validators

Re-exported from component types.ts

Single source of truth
3. Component-based responsibility

Separate concerns: Page orchestrates, Components display, Modals handle forms

Props for callbacks, state managed at page level