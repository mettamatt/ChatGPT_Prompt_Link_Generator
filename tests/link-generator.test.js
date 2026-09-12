const test = require("node:test");
const assert = require("node:assert/strict");

const { createChatGptUrl, createOutput } = require("../link-generator.js");

test("creates a ChatGPT q link", () => {
  assert.equal(
    createChatGptUrl("Explain photosynthesis"),
    "https://chatgpt.com/?q=Explain%20photosynthesis"
  );
});

test("encodes punctuation, newlines, Unicode, and emoji", () => {
  const prompt = "Why A&B?\nEspañol: sí 👋";
  const url = createChatGptUrl(prompt);

  assert.equal(new URL(url).searchParams.get("q"), prompt);
});

test("returns the plain URL when icon mode is disabled", () => {
  const url = createChatGptUrl("Hello");
  assert.equal(createOutput(url, false), url);
});

test("creates a self-contained accessible icon link", () => {
  const url = createChatGptUrl("Hello");
  const output = createOutput(url, true);

  assert.match(output, /^<a href="https:\/\/chatgpt\.com\/\?q=Hello"/);
  assert.match(output, /aria-label="Open in ChatGPT"/);
  assert.match(output, /rel="noopener noreferrer"/);
  assert.match(output, /<svg[^>]+aria-hidden="true"/);
  assert.doesNotMatch(output, /src="icons\//);
});
