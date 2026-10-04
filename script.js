const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

let notes = [];

function categoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render() {
  notesList.replaceChildren();

  notes.forEach((note) => {
    const item = document.createElement("li");
    item.className = `note-card ${categoryClass(note.category)}`;

    const text = document.createElement("p");
    text.textContent = note.text;

    const metadata = document.createElement("div");
    metadata.className = "note-meta";

    const details = document.createElement("span");
    details.textContent = `${note.category} · ${note.createdAt}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.noteId = note.id;

    metadata.append(details, deleteButton);
    item.append(text, metadata);
    notesList.append(item);
  });
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  if (!text) {
    return;
  }

  notes.push({
    id: crypto.randomUUID(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  });

  noteInput.value = "";
  render();
});

render();
