import { todoController } from "@server/controller/todo";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return await todoController.deleteById(request, params.id);
}
