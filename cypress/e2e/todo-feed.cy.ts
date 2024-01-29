const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("when create a new todo, it must appears in the screen", () => {
    // 0 - Interceptações/Interceptação
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "45913e7b-e109-4586-bde8-33589de4b40e",
            date: "2024-01-29T14:15:38.880Z",
            content: "Test todo",
            done: false,
          },
        },
      });
    }).as("createTodo");

    // 1 - Abrir a página
    cy.visit(BASE_URL);
    // 2 - Selecionar o input de criar nova todo
    // 3 - Digit no input de criar nova todo
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Test todo");
    // 4 - Clicar no botão
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();
    // 5 - Checar se na página surgiu um novo elemento
    cy.get("table > tbody").contains("Test todo");
  });
});
