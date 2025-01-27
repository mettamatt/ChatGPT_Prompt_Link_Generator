// options.js

// Reference to our single checkbox
const useIconSnippetCheckbox = document.getElementById(
  "useIconSnippetCheckbox"
);
const saveBtn = document.getElementById("saveBtn");

// On page load, fetch existing setting (default to true)
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ useIconSnippet: true }, (items) => {
    useIconSnippetCheckbox.checked = items.useIconSnippet;
  });
});

// When user clicks "Save Preferences"
saveBtn.addEventListener("click", () => {
  const useIconSnippet = useIconSnippetCheckbox.checked;

  // Store setting in chrome.storage.sync
  chrome.storage.sync.set({ useIconSnippet }, () => {
    alert("Preferences saved!");
  });
});
