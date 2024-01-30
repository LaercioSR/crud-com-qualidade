export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  // eslint-disable-next-line no-console
  console.log(request.headers);
  return new Response(JSON.stringify({ message: "Olá mundo" }), {
    status: 200,
  });
}
