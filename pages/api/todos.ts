import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") {
    todoController.get(request, response);
    return;
  }
  if (request.method === "POST") {
    todoController.create(request, response);
    return;
  }

  response.status(405).json({ message: "Method not allowed" });
}
