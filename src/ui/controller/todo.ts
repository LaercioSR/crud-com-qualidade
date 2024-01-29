import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}
async function get({ page }: TodoControllerGetParams) {
  return todoRepository.get({
    page,
    limit: 2,
  });
}

interface TodoControllerFilterByContentParams<Todo> {
  search: string;
  todos: Array<Todo & { content: string }>;
}
function filterTodosByContent<Todo>({
  search,
  todos,
}: TodoControllerFilterByContentParams<Todo>): Array<Todo> {
  const filteredTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });
  return filteredTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onSuccess: (todo: Todo) => void;
  onError: (customMessage?: string) => void;
}
function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  // Fail Fast
  const parsedParams = schema.string().min(1).safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }
  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerToggleDoneParams {
  id: string;
  updateTodoOnScreen: () => void;
  onError: () => void;
}
function toggleDone({
  id,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams) {
  // Optimistic Update
  // updateTodoOnScreen();
  todoRepository
    .toggleDone(id)
    .then(() => {
      // Real Update
      updateTodoOnScreen();
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerDeleteParams {
  id: string;
}
async function deleteById({ id }: TodoControllerDeleteParams): Promise<void> {
  const todoId = id;
  await todoRepository.deleteById(todoId);
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
  deleteById,
};
