import { users } from "@/src/db/schema";
import { db } from "@/src/lib/db";

export async function GET() {
  try {
    const result = await db.select().from(users).limit(1);
    return Response.json({
      status: "✅ Connected",
      rowsFound: result.length,
      message: "Database connection successful",
    });
  } catch (error: any) {
    return Response.json(
      {
        status: "❌ Connection Failed",
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    );
  }
}
