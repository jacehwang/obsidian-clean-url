# Clean URL

Clean URL removes known tracking parameters from URLs when you paste text into an Obsidian editor. It scans the full pasted text, updates every supported URL in place, and preserves the surrounding Markdown.

## Features

- Cleans all pasted `http` and `https` URLs in a block of text
- Preserves non-URL text, Markdown links, autolinks, and fragments
- Keeps the cleaning policy conservative by removing only known tracking parameters
- Lets you add extra parameters to remove and parameters that should never be removed
- Provides a command to clean URLs in the current selection

## Development

This plugin uses Bun for package management, script execution, and tests.

```bash
bun install
bun run dev
```

Useful commands:

```bash
bun run build
bun test
bun run lint
```

## Manual testing

This repository lives inside the target vault's plugin directory, so `bun run dev` updates the installed plugin in place.

1. Run `bun run dev`
2. Reload Obsidian
3. Enable **Clean URL** in **Settings → Community plugins**
4. Paste text that contains URLs with `utm_*` or other supported tracking parameters
5. Verify `Never remove parameters` keeps selected names even when they match built-in or extra removal rules

## Release

Release assets must include:

- `main.js`
- `manifest.json`
