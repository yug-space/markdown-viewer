# Contributing

Thanks for your interest in contributing to Markdown Viewer.

## Setup

```bash
git clone <repo>
cd markdown-viewer/app
npm install
npm start
```

## Code Style

- Two-space indentation
- No semicolons enforced — keep the existing style of the file
- Plain JavaScript (no TypeScript) in the desktop app
- Keep the design black & white

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes with clear messages
4. Push and open a PR with a description of what changed and why

## Reporting Issues

Use GitHub Issues. Include:
- Operating system and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant

## Philosophy

This is a small, focused tool. Before adding a feature, ask:
- Does this serve the core use case (viewing markdown)?
- Can it be done without adding UI clutter?
- Does it preserve the black & white aesthetic?

If the answer to any of these is "no", it probably doesn't belong.
