import React, { useState, useMemo } from "react";
import "./App.css";

// Generisanje jedinstvenog ID-a je sada ugrađeno
const generateId = () => Date.now();

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'done'
  const [sort, setSort] = useState("default"); // 'default', 'alphabetical'
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 1. Dodaj novi task (sa ID-om i podrškom za Enter)
  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      { id: generateId(), text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // 2. Označi task kao urađen/neurađen (koristi ID)
  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  // 3. Obriši task (koristi ID)
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // 4. Pokreni uređivanje
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  // 5. Sačuvaj uređeni task
  const saveEdit = (id) => {
    if (editText.trim() === "") {
      deleteTask(id); // Opcionalno: Obriši ako je unos prazan
      setEditingId(null);
      return;
    }
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editText.trim() } : task
    );
    setTasks(updatedTasks);
    setEditingId(null);
  };

  // 6. Filtriranje i sortiranje zadataka
  const filteredAndSortedTasks = useMemo(() => {
    let list = tasks;

    // Filtriranje
    if (filter === "active") {
      list = list.filter((task) => !task.done);
    } else if (filter === "done") {
      list = list.filter((task) => task.done);
    }

    // Sortiranje
    if (sort === "alphabetical") {
      list = [...list].sort((a, b) => a.text.localeCompare(b.text));
    }

    return list;
  }, [tasks, filter, sort]);

  const activeTasksCount = tasks.filter((t) => !t.done).length;

  return (
    <div className="app">
      <h1>📝 To-Do Lista</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Unesi novi zadatak..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress} // Dodata podrška za Enter
        />
        <button onClick={addTask}>Dodaj</button>
      </div>

      <div className="controls">
        <div className="filter-sort">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Svi zadaci</option>
            <option value="active">Aktivni</option>
            <option value="done">Urađeni</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Zadnje dodano</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
        <p className="task-count">
          Preostalo: <strong>{activeTasksCount}</strong>
        </p>
      </div>

      <ul className="task-list">
        {filteredAndSortedTasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(task.id)} // Sačuvaj kad se izgubi fokus
                onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                autoFocus
                className="edit-input"
              />
            ) : (
              <span onClick={() => startEdit(task)}>{task.text}</span>
            )}
            <div className="task-actions">
              {/* Dugme za prebacivanje statusa (klikom na tekst) */}
              <button
                className="toggle-btn"
                onClick={() => toggleTask(task.id)}
              >
                {task.done ? "🔄" : "✅"}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
      {filteredAndSortedTasks.length === 0 && (
        <p className="empty-message">Nema zadataka za prikaz.</p>
      )}
    </div>
  );
}

export default App;