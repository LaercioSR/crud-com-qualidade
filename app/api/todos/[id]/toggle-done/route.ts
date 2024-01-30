import { todoController } from "@server/controller/todo";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return await todoController.toggleDone(request, params.id);
}
