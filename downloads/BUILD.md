# Asgard Code - Build Instructions

This document describes how to build Asgard Code for both CLI and Desktop versions.

## Prerequisites

- [Bun](https://bun.sh/) v1.3.5 or later
- [Rust](https://rustup.rs/) (for desktop builds)
- [Tauri CLI](https://tauri.app/) (for desktop builds)

## Building the CLI

To build the CLI for your current platform:

```bash
cd packages/opencode
bun install
bun run build --single
```

The binary will be placed in `packages/opencode/dist/asgard-code-<platform>-<arch>/bin/asgard-code`.

To build for all supported platforms:

```bash
cd packages/opencode
bun install
bun run build
```

### Supported Platforms

| Platform | Architecture | Variant |
|----------|-------------|---------|
| Linux | x64 | glibc, musl, baseline |
| Linux | arm64 | glibc, musl |
| macOS | x64 | normal, baseline |
| macOS | arm64 | normal |
| Windows | x64 | normal, baseline |

## Building the Desktop App

To build the desktop application:

```bash
cd packages/desktop

# Install dependencies
bun install

# Build for development
bun run tauri dev

# Build for production
bun run tauri build
```

### Desktop Build Outputs

The desktop builds will be placed in:

- **macOS**: `packages/desktop/src-tauri/target/release/bundle/dmg/`
- **Windows**: `packages/desktop/src-tauri/target/release/bundle/nsis/`
- **Linux**: `packages/desktop/src-tauri/target/release/bundle/deb/` and `packages/desktop/src-tauri/target/release/bundle/rpm/`

## GitHub Actions

The repository includes GitHub Actions workflows that automatically build and publish releases:

- CLI builds for all platforms
- Desktop builds for macOS, Windows, and Linux
- Automatic artifact upload to GitHub Releases

## Download Pre-built Binaries

After the CI builds complete, binaries will be available at:

- CLI: `asgard-code-<platform>-<arch>.[zip|tar.gz]`
- Desktop (macOS): `asgard-code-desktop-darwin-aarch64.dmg`, `asgard-code-desktop-darwin-x64.dmg`
- Desktop (Windows): `asgard-code-desktop-windows-x64.exe`
- Desktop (Linux): `.deb`, `.rpm`, or AppImage
