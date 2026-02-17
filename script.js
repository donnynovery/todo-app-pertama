let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch {
  tasks = [];
}

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const loadBtn = document.getElementById("loadBtn");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const loadingText = document.getElementById("loadingText");

const save = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateCounter = () => {
  const unfinished = tasks.filter((task) => !task.done).length;
  counter.innerText = `Total Task: ${tasks.length} | Not finished yet: ${unfinished}`;
};

const render = () => {
  list.innerHTML = "";

  tasks.forEach(({ text, done }, index) => {
    const li = document.createElement("li");
    if (done) li.classList.add("done");

    const span = document.createElement("span");
    const icon = done ? "☑ " : "☐ ";
    span.innerText = icon + text;

    span.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      save();
      render();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      save();
      render();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  updateCounter();
};

button.addEventListener("click", () => {
  if (input.value.trim() === "") {
    alert("To-do list cannot be empty!");
    return;
  }

  tasks.push({ text: input.value, done: false });
  save();
  render();
  input.value = "";
  input.focus();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});

const loadFromAPI = async () => {
  try {
    loadingText.innerText = "Loading...";
    loadBtn.disabled = true;

    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=10",
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve data");
    }

    const data = await response.json();

    tasks = data.map((item) => ({
      text: item.title,
      done: item.completed,
    }));

    save();
    render();
  } catch (error) {
    alert("An error occurred while retrieving data!");
    console.error(error);
  } finally {
    loadingText.innerText = "";
    loadBtn.disabled = false;
  }
};

loadBtn.addEventListener("click", loadFromAPI);
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  const yakin = confirm("Are you sure you want to delete ALL tasks?");

  if (yakin) {
    tasks = [];
    save();
    render();
  }
});

render();
