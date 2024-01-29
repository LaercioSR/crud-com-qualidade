import { z as schema } from "zod";

export const TodoSchema = schema.object({
  id: schema.string().uuid(),
  content: schema.string(),
  date: schema.string().transform((date) => {
    return new Date(date).toISOString();
  }),
  done: schema.string().transform((done) => {
    if (done === "true") return true;
    return false;
  }),
});

export type Todo = schema.infer<typeof TodoSchema>;
