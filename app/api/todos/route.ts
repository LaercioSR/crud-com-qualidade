import { todoController } from "@server/controller/todo";

export async function GET(request: Request) {
  return await todoController.get(request);
}

export async function POST(request: Request) {
  return await todoController.create(request);
}
