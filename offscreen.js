const clipboard = document.getElementById("clipboard");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target !== "offscreen" || message.type !== "copy-to-clipboard") {
    return false;
  }

  copyText(message.text)
    .then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    clipboard.value = text;
    clipboard.select();

    if (!document.execCommand("copy")) {
      throw new Error("Clipboard write was rejected");
    }
  } finally {
    clipboard.value = "";
  }
}
