const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const themeToggle = document.querySelector("#theme-toggle");
const clearAllButton = document.querySelector("#clear-all");
const NOTES_STORAGE_KEY = "quicknotes-notes";
const THEME_STORAGE_KEY = "quicknotes-theme";

let notes = [];

function categoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function render() {
  notesList.replaceChildren();
  const searchTerm = searchInput.value.trim().toLowerCase();
  const visibleNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm),
  );

  if (searchTerm) {
    noteCount.textContent = `Showing ${visibleNotes.length} of ${notes.length} notes`;
  } else {
    noteCount.textContent =
      notes.length === 0
        ? "You have no notes yet."
        : `You have ${notes.length} ${notes.length === 1 ? "note" : "notes"}.`;
  }

  if (visibleNotes.length === 0 && searchTerm) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No notes match your search.";
    notesList.append(emptyMessage);
    return;
  }

  visibleNotes.forEach((note) => {
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
  saveNotes();
  render();
});

clearAllButton.addEventListener("click", () => {
  if (!confirm("Delete all notes?")) {
    return;
  }

  notes = [];
  saveNotes();
  render();
});

function saveNotes() {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  updateThemeButton();
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
  saveNotes();
  render();
});

searchInput.addEventListener("input", render);

const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
if (savedNotes) {
  try {
    const parsedNotes = JSON.parse(savedNotes);
    if (Array.isArray(parsedNotes)) {
      notes = parsedNotes;
    }
  } catch (error) {
    console.error("Unable to load saved notes.", error);
  }
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (
  savedTheme === "dark" ||
  (savedTheme === null &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.body.classList.add("dark");
}

updateThemeButton();
render();
