import { getUserRole } from "@/src/db/queries/permissions";
import { assertPermission, PermissionDeniedError } from "@/src/lib/permissions/middleware";
import { Action } from "@/src/validators/permissions";
import { NextRequest, NextResponse } from "next/server";

/**
 * Example API route showing permission checking
 * DELETE /api/invoices/:id
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    // Get userId from request (auth middleware)
    // TODO: Implement actual auth header parsing
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    }

    // Get user role
    const role = await getUserRole(userId);

    // Check delete permission
    assertPermission(role, Action.DELETE);

    // TODO: Implement actual deletion logic
    const invoiceId = context.params.id;
    console.log(`Deleting invoice ${invoiceId}`);

    return NextResponse.json({ success: true, invoiceId });
  } catch (error) {
    if (error instanceof PermissionDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Example API route: GET /api/invoices
 * Anyone can read
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    }

    // Get user role
    const role = await getUserRole(userId);

    // Check read permission
    assertPermission(role, Action.READ);

    // TODO: Implement actual fetch logic
    return NextResponse.json({ invoices: [] });
  } catch (error) {
    if (error instanceof PermissionDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
