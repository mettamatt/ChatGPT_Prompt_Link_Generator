const CHATGPT_BASE_URL = "https://chatgpt.com/?q=";

const CHATGPT_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle"><path d="M21 12v3a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7"/><path d="M16 3h5v5"/><path d="m16 8 5-5"/></svg>';

function createChatGptUrl(prompt) {
  return CHATGPT_BASE_URL + encodeURIComponent(prompt);
}

function createOutput(url, useIconSnippet) {
  if (!useIconSnippet) {
    return url;
  }

  return `<a href="${url}" aria-label="Open in ChatGPT" title="Open in ChatGPT" target="_blank" rel="noopener noreferrer">${CHATGPT_ICON_SVG}</a>`;
}

if (typeof module !== "undefined") {
  module.exports = { createChatGptUrl, createOutput };
}
