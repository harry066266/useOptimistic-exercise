import { useEffect, useState } from "react";
import { useOptimistic, useTransition } from "react";

async function getTodos() {
  const response = await fetch("http://localhost:8080/api/todos");
  return await response.json();
}
async function postTodos(text) {
  const response = await fetch("http://localhost:8080/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Failed to add todo");
  return await response.json();
}
function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [optimisticTodos, simplifiedAddTodo] = useOptimistic(
    todos,
    (state, text) => {
      return [...state, { id: state.length + 1, text }];
    }
  );
  const [ispending, startTransition] = useTransition();
  async function addTodo() {
    simplifiedAddTodo(newTodo);
    await postTodos(newTodo);
    setTodos(await getTodos());

    setNewTodo("");
  }
  useEffect(() => {
    getTodos().then(setTodos);
  }, []);
  return (
    <>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <input
        type="text"
        disabled={ispending}
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") startTransition(() => addTodo());
        }}
      />
    </>
  );
}

export default App;
