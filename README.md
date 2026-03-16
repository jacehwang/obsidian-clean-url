# Clean URL

Clean URL removes known tracking parameters from URLs when you paste text into an Obsidian editor. It scans the full pasted text, updates every supported URL in place, and preserves the surrounding Markdown.

## Features

- Cleans all pasted `http` and `https` URLs in a block of text
- Preserves non-URL text, Markdown links, autolinks, and fragments
- Keeps the cleaning policy conservative by removing only known tracking parameters
- Lets you add extra parameters to remove and parameters that should never be removed
- Applies preserve rules before built-in and custom removal rules
- Provides a command to clean URLs in the current selection

## Built-in tracking parameters

| Scope | Parameters |
| --- | --- |
| All supported hosts | `utm_*`, `fbclid`, `gclid`, `dclid`, `mc_cid`, `mc_eid`, `mkt_tok` |
| `instagram.com` | `igsh`, `igshid` |
| `youtube.com`, `youtu.be` | `si` |

## Usage

- Paste text that contains one or more `http` or `https` links into the editor.
- The plugin removes supported tracking parameters from each detected link.
- Use the `Clean selected links` command to clean URLs inside the current selection.
- Use `Parameters to keep` if you want to preserve a parameter even when it matches a built-in or custom removal rule.

## Privacy and disclosures

- No network requests or external services are used.
- No accounts, subscriptions, payments, or ads are required.
- No telemetry or analytics are collected.
- URL cleaning runs locally on pasted text and command selections.
- The plugin does not access files outside your vault.

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
5. Verify `Parameters to keep` preserves selected names even when they match built-in or extra removal rules
6. Toggle `Preserve fragment` and confirm fragments are kept or removed as expected

## Release

Release assets must include:

- `main.js`
- `manifest.json`
