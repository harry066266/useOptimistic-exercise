import express from "express";
import cors from "cors";
const todos = [
  { id: 1, text: "Learn React" },
  { id: 2, text: "Learn Vite" },
];
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/todos", (req, res) => {
  res.json(todos);
});
app.post("/api/todos", (req, res) => {
  setTimeout(() => {
    const body = req.body || {};
    const newTodo = { id: todos.length + 1, text: body.text };
    todos.push(newTodo);
    res.json(newTodo);
  }, 3000);
});
app.listen(8080, () => console.log("Server running on http://localhost:8080"));
