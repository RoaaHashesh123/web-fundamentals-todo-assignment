// File: js/app.js
// Student: Roaa Hashesh (12429422)

const STUDENT_ID = "12429422";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");


function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}


document.addEventListener("DOMContentLoaded", async function () {
     setStatus("Loading tasks...");
  const url = `${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
    const data = await res.json();
    list.innerHTML = "";

    if (data.tasks && data.tasks.length > 0) {
      data.tasks.forEach(task => renderTask(task));
      setStatus("");
    } else {
      setStatus("No tasks found.");
    }
  } catch (err) {
    console.error(err);
    setStatus("Error loading tasks", true);
  }

});


if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
      const title = input.value.trim();
    if (!title) return;

    setStatus("Adding task...");

    const url = `${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      const data = await res.json();

      if (data.success && data.task) {
        renderTask(data.task);
        input.value = "";
        setStatus("Task added successfully!");
      } else {
        setStatus(data.message || "Error adding task", true);
      }
    } catch (err) {
      console.error(err);
      setStatus(err.message, true);
    }
  });
}


function renderTask(task) {
    const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;

  const btn = document.createElement("button");
  btn.className = "task-delete";
  btn.textContent = "Delete";

  btn.addEventListener("click", function () {
    deleteTask(task.id, li);
  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);

 
}
async function deleteTask(id, liElement) {
  if (!confirm("Delete this task?")) return;

  const url = `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${id}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      liElement.remove();
      setStatus("Task deleted successfully!");
    } else {
      setStatus(data.message || "Error deleting task", true);
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message, true);
  }
}