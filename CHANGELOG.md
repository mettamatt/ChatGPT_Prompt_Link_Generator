# Changelog

All notable changes to this project are documented here.

## [1.1.0] - 2026-09-12

### Changed

- Generate direct `https://chatgpt.com/?q=...` links instead of using the former `chat.openai.com` hostname and `model=auto` parameter.
- Use an extension-owned offscreen document for reliable clipboard writes.
- Make plain URLs the default output for new installations while preserving existing saved preferences.
- Make HTML icon links self-contained with an inline SVG and safer link attributes.
- Open preferences when the extension toolbar icon is clicked.
- Warn when a prompt would create a URL longer than 8,000 characters instead of copying a misleading fallback URL.
- Refresh the options page and replace its blocking alert with an accessible saved-status message.

### Privacy and permissions

- Remove the content script and access to all website URLs.
- Remove the `activeTab` and `scripting` permissions.
- Add `offscreen` and `clipboardWrite` permissions for extension-owned clipboard access.

### Development

- Add tests for URL encoding and plain/icon output generation.
- Require Chrome 109 or later.

## [1.0.0] - 2025-01-27

- Initial release.
