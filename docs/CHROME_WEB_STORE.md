# Chrome Web Store Submission Notes

Use this copy when updating the Chrome Web Store listing for version 1.1.0. Verify that the final dashboard disclosures exactly match the submitted package and the published privacy policy.

## Single purpose

Turn text explicitly selected by the user into a shareable ChatGPT prompt link and copy it to the clipboard.

## Short description

Generate a shareable ChatGPT prompt link from highlighted text.

## Detailed description

Create a shareable ChatGPT prompt link without leaving the page you are reading.

1. Highlight the prompt text.
2. Right-click and choose **Generate ChatGPT Link**.
3. Paste the copied plain URL or self-contained HTML icon link wherever you want to share it.

Links use the format `https://chatgpt.com/?q=...`. Link generation happens locally. The extension has no analytics, advertising, tracking, developer-operated backend, or access to all the websites you visit.

The toolbar icon opens one preference: copy a plain URL or a self-contained HTML icon link. Plain URL is the default for new installations.

Important: Anyone with a generated link can read its prompt. ChatGPT's `?q=` behavior is not documented as a public API and may change without notice. This extension is not affiliated with or endorsed by OpenAI.

## Permission justifications

### `contextMenus`

Adds the single **Generate ChatGPT Link** command that the user invokes after explicitly selecting text.

### `clipboardWrite`

Writes only the generated URL or HTML icon link requested by the user to the system clipboard. The extension never reads clipboard contents.

### `notifications`

Confirms that a link was copied and reports actionable errors, such as a selection that would create an overly long URL.

### `offscreen`

Creates a hidden, extension-owned document solely to perform the user-requested clipboard write from the Manifest V3 service worker.

### `storage`

Stores one synchronized boolean preference selecting plain URL or HTML icon-link output. Selected text and generated links are not stored.

## Remote code

Select **No, I am not using remote code**. All executable code is included in the extension package.

## User data disclosure

The extension transiently handles **website content**: only text the user explicitly selects before invoking the context-menu command. It URL-encodes that text locally and writes the generated output to the clipboard. It does not transmit the selected text or generated link to the developer or any developer-operated service, and it does not retain either value.

The output-format preference is stored through Chrome's synchronized extension storage. No account, authentication, analytics, advertising, location, financial, health, or browsing-history data is collected by the developer.

Privacy policy URL:

`https://github.com/mettamatt/ChatGPT_Prompt_Link_Generator/blob/main/PRIVACY.md`

## Suggested category

**Functionality & UI**

## Reviewer test instructions

1. Open any normal webpage containing selectable text.
2. Select a short sentence.
3. Right-click and choose **Generate ChatGPT Link**.
4. Paste the clipboard contents and verify that it begins with `https://chatgpt.com/?q=`.
5. Click the extension toolbar icon, enable **Copy as an icon link**, and save.
6. Repeat steps 2–4 and verify that the clipboard contains an HTML `<a>` element with an inline `<svg>`.

No account or credentials are required to test link generation. ChatGPT may require its own login when a generated link is opened.

## Release checklist

- [ ] Publish `PRIVACY.md` before entering its URL in the dashboard.
- [ ] Upload the ZIP produced by `scripts/package-release.sh`.
- [ ] Confirm the version shown by the dashboard is `1.1.0`.
- [ ] Replace outdated listing copy and screenshots.
- [ ] Explain the new clipboard permission in the release notes.
- [ ] Complete and verify every Privacy tab declaration.
- [ ] Select deferred publishing when submitting for review.
