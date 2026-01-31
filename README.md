<p align="center">
  <a href="#">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Asgard Code logo">
    </picture>
  </a>
</p>
<p align="center">AI-powered development tool.</p>
<p align="center">
  <a href="https://github.com/Hecker7727/asgard-code/actions"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/Hecker7727/asgard-code/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a>
</p>

[![Asgard Code Terminal UI](packages/web/src/assets/lander/screenshot.png)](#)

---

### Installation

```bash
# Package managers
npm i -g asgard-code@latest        # or bun/pnpm/yarn
```

### Desktop App (BETA)

Asgard Code is also available as a desktop application. Download directly from the [releases page](https://github.com/Hecker7727/asgard-code/releases).

| Platform              | Download                                   |
| --------------------- | ------------------------------------------ |
| macOS (Apple Silicon) | `asgard-code-desktop-darwin-aarch64.dmg`   |
| macOS (Intel)         | `asgard-code-desktop-darwin-x64.dmg`       |
| Windows               | `asgard-code-desktop-windows-x64.exe`      |
| Linux                 | `.deb`, `.rpm`, or AppImage                |

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$ASGARD_CODE_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if exists or can be created)
4. `$HOME/.asgard-code/bin` - Default fallback

### Agents

Asgard Code includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also, included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

### Contributing

If you're interested in contributing to Asgard Code, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### FAQ

#### How is this different from Claude Code?

It's very similar to Claude Code in terms of capability. Here are the key differences:

- 100% open source
- Not coupled to any provider. Asgard Code can be used with Claude, OpenAI, Google or even local models. As models evolve the gaps between them will close and pricing will drop so being provider-agnostic is important.
- Out of the box LSP support
- A focus on TUI. Asgard Code is built with a focus on terminal experience; we are going to push the limits of what's possible in the terminal.
- A client/server architecture. This for example can allow Asgard Code to run on your computer, while you can drive it remotely from a mobile app. Meaning that the TUI frontend is just one of the possible clients.

---
