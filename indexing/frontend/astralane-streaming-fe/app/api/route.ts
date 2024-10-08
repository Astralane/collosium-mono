export const dynamic = "force-static";

export async function GET() {
  const data = { data: "my data" };

  return Response.json({ data });
}
