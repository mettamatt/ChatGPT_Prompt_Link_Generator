// background.js

// ----------------------------------------------------
// 1. Define generous defaults as constants (not user-facing)
// ----------------------------------------------------
const PROMPT_CHAR_LIMIT = 20000; // or any large number
const MAX_URL_LENGTH = 8000; // also fairly large
const FALLBACK_URL =
  "https://chat.openai.com/?model=auto&q=Prompt+exceeded+max+URL+length";

// ----------------------------------------------------
// 2. Create the context menu on install
// ----------------------------------------------------
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generate-chatgpt-link",
    title: "Generate ChatGPT Link",
    contexts: ["selection"],
  });
});

// ----------------------------------------------------
// 3. Listen for dark/light mode messages from content script
// ----------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (typeof message.isDarkMode === "boolean") {
    if (message.isDarkMode) {
      // Use dark icons
      chrome.action.setIcon({
        path: {
          16: "icons/dark-icon16.png",
          48: "icons/dark-icon48.png",
          128: "icons/dark-icon128.png",
        },
      });
    } else {
      // Use light icons
      chrome.action.setIcon({
        path: {
          16: "icons/light-icon16.png",
          48: "icons/light-icon48.png",
          128: "icons/light-icon128.png",
        },
      });
    }
  }
});

// ----------------------------------------------------
// 4. Handle context menu clicks
// ----------------------------------------------------
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.selectionText || !info.selectionText.trim()) {
    showNotification("No Text Selected", "Please highlight some text first.");
    return;
  }

  // 4a. Truncate the prompt if beyond PROMPT_CHAR_LIMIT
  const prompt = info.selectionText.trim();
  let truncatedPrompt = prompt;
  if (prompt.length > PROMPT_CHAR_LIMIT) {
    truncatedPrompt = prompt.slice(0, PROMPT_CHAR_LIMIT) + "...";
  }

  // 4b. Construct the ChatGPT URL
  const baseUrl = "https://chat.openai.com/?model=auto&q=";
  let finalUrl = baseUrl + encodeURIComponent(truncatedPrompt);

  // 4c. If the URL is too long, fallback to a generic link
  if (finalUrl.length > MAX_URL_LENGTH) {
    finalUrl = FALLBACK_URL;
  }

  // 4d. Decide whether to return an icon snippet or just the URL
  const { useIconSnippet = true } = await getPreferences();
  let outputText;

  if (useIconSnippet) {
    // Return an HTML snippet with an <img> icon
    // Make sure you have 'open-in-chatgpt.svg' in your 'icons/' folder.
    outputText = `
      <a href="${finalUrl}" aria-label="Open in ChatGPT">
        <img src="icons/open-in-chatgpt.svg" alt="" aria-hidden="true">
      </a>
    `.trim();
  } else {
    // Return plain URL
    outputText = finalUrl;
  }

  // 4e. Try injecting a script to copy the final output to clipboard
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (textToCopy) => navigator.clipboard.writeText(textToCopy),
      args: [outputText],
    });
    showNotification(
      "Link Copied",
      "Your ChatGPT link has been copied to the clipboard."
    );
  } catch (err) {
    console.error("Script injection failed:", err);
    showNotification("Copy Failed", "Could not copy link (restricted page?).");
  }
});

// ----------------------------------------------------
// 5. Fetch user preference from storage (only one: useIconSnippet)
// ----------------------------------------------------
async function getPreferences() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { useIconSnippet: true }, // default
      (items) => resolve(items)
    );
  });
}

// ----------------------------------------------------
// 6. Helper for notifications in MV3 service worker
// ----------------------------------------------------
function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: title,
    message: message,
    priority: 2,
  });
}
