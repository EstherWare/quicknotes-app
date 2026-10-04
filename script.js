const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

function categoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render() {
  notesList.replaceChildren();
  noteCount.textContent =
    notes.length === 0
      ? "You have no notes yet."
      : `You have ${notes.length} ${notes.length === 1 ? "note" : "notes"}.`;

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

notesList.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }

  const noteId = event.target.dataset.noteId;
  notes = notes.filter((note) => note.id !== noteId);
  render();
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  if (text.length === 0) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  notes.push({
    id: crypto.randomUUID(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  });

  noteInput.value = "";
  errorMessage.textContent = "";
  render();
});

render();
