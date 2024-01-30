"use client";
import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

// const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";
const bg = "/bg.jpeg";

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

export default function HomePage() {
  // const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  const initialLoadComplete = React.useRef(false);
  const [newTodoContent, setNewTodoContent] = React.useState("");
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [todos, setTodos] = React.useState<HomeTodo[]>([]);
  const homeTodos = todoController.filterTodosByContent<HomeTodo>({
    todos,
    search,
  });

  const hasMorePage = totalPages > page;
  const hasNoTodos = homeTodos.length === 0 && !isLoading;

  // Load infos onload
  React.useEffect(() => {
    // setInitialLoadComplete(true);
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles themeName="devsoutinho" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSuccess(todo: HomeTodo) {
                setTodos((oldTodos) => {
                  return [...oldTodos, todo];
                });
              },
              onError(customMessage) {
                alert(
                  customMessage ||
                    "Você precisa ter um conteúdo para criar uma TODO!"
                );
              },
            });
            setNewTodoContent("");
          }}
        >
          <input
            name="add-todo"
            type="text"
            placeholder="Correr, Estudar..."
            onChange={function newTodoHandler(event) {
              setNewTodoContent(event.target.value);
            }}
            value={newTodoContent}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function handleSearch(event) {
              setSearch(event.target.value);
            }}
            value={search}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((todo) => {
              return (
                <tr key={todo.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={function handleToggle() {
                        todoController.toggleDone({
                          id: todo.id,
                          onError() {
                            alert("Falha ao atualizar a TODO :(");
                          },
                          updateTodoOnScreen() {
                            setTodos((currentTodos) => {
                              return currentTodos.map((currentTodo) => {
                                if (currentTodo.id === todo.id) {
                                  return {
                                    ...currentTodo,
                                    done: !currentTodo.done,
                                  };
                                }
                                return currentTodo;
                              });
                            });
                          },
                        });
                      }}
                    />
                  </td>
                  <td>{todo.id.substring(0, 5)}</td>
                  <td>
                    {!todo.done && todo.content}
                    {todo.done && <s>{todo.content}</s>}
                  </td>
                  <td align="right">
                    <button
                      data-type="delete"
                      onClick={function handleClick() {
                        todoController
                          .deleteById({
                            id: todo.id,
                          })
                          .then(() => {
                            setTodos((currentTodos) => {
                              return currentTodos.filter((currentTodo) => {
                                return currentTodo.id !== todo.id;
                              });
                            });
                          })
                          .catch(() => {
                            console.error("Failed to delete");
                          });
                      }}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePage && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);

                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((previous) => {
                            return [...previous, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
