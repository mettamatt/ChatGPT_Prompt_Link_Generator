// options.js

// Reference to our single checkbox
const useIconSnippetCheckbox = document.getElementById(
  "useIconSnippetCheckbox"
);
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

// On page load, fetch existing setting (default to false)
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ useIconSnippet: false }, (items) => {
    useIconSnippetCheckbox.checked = items.useIconSnippet;
  });
});

// When user clicks "Save Preferences"
saveBtn.addEventListener("click", () => {
  const useIconSnippet = useIconSnippetCheckbox.checked;

  // Store setting in chrome.storage.sync
  chrome.storage.sync.set({ useIconSnippet }, () => {
    status.textContent = "Saved";
    window.setTimeout(() => {
      status.textContent = "";
    }, 2000);
  });
});
