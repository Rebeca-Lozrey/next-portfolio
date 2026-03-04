import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();

  const result = await db.command({ ping: 1 });

  return Response.json(result);
}
