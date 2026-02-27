import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const db = client.db("social-network");

  const result = await db.command({ ping: 1 });

  return Response.json(result);
}
