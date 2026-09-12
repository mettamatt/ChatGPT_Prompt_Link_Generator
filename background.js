importScripts("link-generator.js");

const MAX_URL_LENGTH = 8000;
const MENU_ID = "generate-chatgpt-link";
const OFFSCREEN_DOCUMENT_PATH = "offscreen.html";

let creatingOffscreenDocument;

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Generate ChatGPT Link",
    contexts: ["selection"],
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const prompt = info.selectionText?.trim();
  if (!prompt) {
    showNotification("No Text Selected", "Please highlight some text first.");
    return;
  }

  const finalUrl = createChatGptUrl(prompt);
  if (finalUrl.length > MAX_URL_LENGTH) {
    showNotification(
      "Prompt Too Long",
      "The selected text is too long for a reliable shareable URL. Shorten the selection and try again."
    );
    return;
  }

  try {
    const { useIconSnippet = false } = await chrome.storage.sync.get({
      useIconSnippet: false,
    });
    const outputText = createOutput(finalUrl, useIconSnippet);

    await copyToClipboard(outputText);
    showNotification(
      useIconSnippet ? "Icon Link Copied" : "Link Copied",
      useIconSnippet
        ? "A self-contained ChatGPT icon link has been copied."
        : "Your ChatGPT prompt link has been copied."
    );
  } catch (error) {
    console.error("Could not copy ChatGPT link:", error);
    showNotification("Copy Failed", "Chrome could not copy the generated link.");
  }
});

async function copyToClipboard(text) {
  await ensureOffscreenDocument();

  try {
    const response = await chrome.runtime.sendMessage({
      target: "offscreen",
      type: "copy-to-clipboard",
      text,
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Clipboard operation failed");
    }
  } finally {
    await chrome.offscreen.closeDocument().catch(() => {});
  }
}

async function ensureOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  let documentExists;

  if ("getContexts" in chrome.runtime) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
      documentUrls: [offscreenUrl],
    });
    documentExists = contexts.length > 0;
  } else {
    const matchedClients = await clients.matchAll();
    documentExists = matchedClients.some((client) => client.url === offscreenUrl);
  }

  if (documentExists) {
    return;
  }

  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen
      .createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: ["CLIPBOARD"],
        justification: "Copy the generated ChatGPT prompt link.",
      })
      .finally(() => {
        creatingOffscreenDocument = null;
      });
  }

  await creatingOffscreenDocument;
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title,
    message,
    priority: 2,
  });
}
