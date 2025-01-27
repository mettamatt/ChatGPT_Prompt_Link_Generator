// content-script.js

// Check initial theme
const darkModeMql = window.matchMedia("(prefers-color-scheme: dark)");
sendThemeToBackground(darkModeMql.matches);

// Listen for changes
darkModeMql.addEventListener("change", (event) => {
  sendThemeToBackground(event.matches);
});

function sendThemeToBackground(isDark) {
  chrome.runtime.sendMessage({ isDarkMode: isDark });
}
