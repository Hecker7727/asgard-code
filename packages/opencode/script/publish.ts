#!/usr/bin/env bun
import { $ } from "bun"
import pkg from "../package.json"
import { Script } from "@asgard-code/script"
import { fileURLToPath } from "url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

const binaries: Record<string, string> = {}
for (const filepath of new Bun.Glob("*/package.json").scanSync({ cwd: "./dist" })) {
  const pkg = await Bun.file(`./dist/${filepath}`).json()
  binaries[pkg.name] = pkg.version
}
console.log("binaries", binaries)
const version = Object.values(binaries)[0]

await $`mkdir -p ./dist/${pkg.name}`
await $`cp -r ./bin ./dist/${pkg.name}/bin`
await $`cp ./script/postinstall.mjs ./dist/${pkg.name}/postinstall.mjs`

await Bun.file(`./dist/${pkg.name}/package.json`).write(
  JSON.stringify(
    {
      name: pkg.name,
      description: "AI-powered development tool - Asgard Code CLI",
      author: "Hecker7727",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/Hecker7727/asgard-code"
      },
      homepage: "https://github.com/Hecker7727/asgard-code",
      bugs: {
        url: "https://github.com/Hecker7727/asgard-code/issues"
      },
      keywords: ["ai", "coding", "cli", "asgard", "development", "agent"],
      bin: {
        "asgard": `./bin/${pkg.name}`,
        [pkg.name]: `./bin/${pkg.name}`,
      },
      scripts: {
        postinstall: "bun ./postinstall.mjs || node ./postinstall.mjs",
      },
      version: version,
      optionalDependencies: binaries,
    },
    null,
    2,
  ),
)

const tasks = Object.entries(binaries).map(async ([name]) => {
  if (process.platform !== "win32") {
    await $`chmod -R 755 .`.cwd(`./dist/${name}`)
  }
  await $`bun pm pack`.cwd(`./dist/${name}`)
  await $`npm publish *.tgz --access public --tag ${Script.channel}`.cwd(`./dist/${name}`)
})
await Promise.all(tasks)
await $`cd ./dist/${pkg.name} && bun pm pack && npm publish *.tgz --access public --tag ${Script.channel}`

const image = "ghcr.io/hecker7727/asgard-code"
const platforms = "linux/amd64,linux/arm64"
const tags = [`${image}:${version}`, `${image}:${Script.channel}`]
const tagFlags = tags.flatMap((t) => ["-t", t])
await $`docker buildx build --platform ${platforms} ${tagFlags} --push .`

// registries
if (!Script.preview) {
  // Calculate SHA values
  const arm64Sha = await $`sha256sum ./dist/asgard-code-linux-arm64.tar.gz | cut -d' ' -f1`.text().then((x) => x.trim())
  const x64Sha = await $`sha256sum ./dist/asgard-code-linux-x64.tar.gz | cut -d' ' -f1`.text().then((x) => x.trim())
  const macX64Sha = await $`sha256sum ./dist/asgard-code-darwin-x64.zip | cut -d' ' -f1`.text().then((x) => x.trim())
  const macArm64Sha = await $`sha256sum ./dist/asgard-code-darwin-arm64.zip | cut -d' ' -f1`.text().then((x) => x.trim())

  const [pkgver, _subver = ""] = Script.version.split(/(-.*)/, 2)

  // arch
  const binaryPkgbuild = [
    "# Maintainer: Hecker7727",
    "",
    "pkgname='asgard-code-bin'",
    `pkgver=${pkgver}`,
    `_subver=${_subver}`,
    "options=('!debug' '!strip')",
    "pkgrel=1",
    "pkgdesc='AI-powered development tool - Asgard Code CLI'",
    "url='https://github.com/Hecker7727/asgard-code'",
    "arch=('aarch64' 'x86_64')",
    "license=('MIT')",
    "provides=('asgard-code')",
    "conflicts=('asgard-code')",
    "depends=('ripgrep')",
    "",
    `source_aarch64=("\${pkgname}_\${pkgver}_aarch64.tar.gz::https://github.com/Hecker7727/asgard-code/releases/download/v\${pkgver}\${_subver}/asgard-code-linux-arm64.tar.gz")`,
    `sha256sums_aarch64=('${arm64Sha}')`,

    `source_x86_64=("\${pkgname}_\${pkgver}_x86_64.tar.gz::https://github.com/Hecker7727/asgard-code/releases/download/v\${pkgver}\${_subver}/asgard-code-linux-x64.tar.gz")`,
    `sha256sums_x86_64=('${x64Sha}')`,
    "",
    "package() {",
    '  install -Dm755 ./asgard-code "${pkgdir}/usr/bin/asgard-code"',
    '  ln -s asgard-code "${pkgdir}/usr/bin/asgard"',
    "}",
    "",
  ].join("\n")

  // Source-based PKGBUILD for asgard-code
  const sourcePkgbuild = [
    "# Maintainer: Hecker7727",
    "",
    "pkgname='asgard-code'",
    `pkgver=${pkgver}`,
    `_subver=${_subver}`,
    "options=('!debug' '!strip')",
    "pkgrel=1",
    "pkgdesc='AI-powered development tool - Asgard Code CLI'",
    "url='https://github.com/Hecker7727/asgard-code'",
    "arch=('aarch64' 'x86_64')",
    "license=('MIT')",
    "provides=('asgard-code')",
    "conflicts=('asgard-code-bin')",
    "depends=('ripgrep')",
    "makedepends=('git' 'bun' 'go')",
    "",
    `source=("asgard-code-\${pkgver}.tar.gz::https://github.com/Hecker7727/asgard-code/archive/v\${pkgver}\${_subver}.tar.gz")`,
    `sha256sums=('SKIP')`,
    "",
    "build() {",
    `  cd "asgard-code-\${pkgver}"`,
    `  bun install`,
    "  cd ./packages/opencode",
    `  ASGARD_CODE_CHANNEL=latest ASGARD_CODE_VERSION=${pkgver} bun run ./script/build.ts --single`,
    "}",
    "",
    "package() {",
    `  cd "asgard-code-\${pkgver}/packages/opencode"`,
    '  mkdir -p "${pkgdir}/usr/bin"',
    '  target_arch="x64"',
    '  case "$CARCH" in',
    '    x86_64) target_arch="x64" ;;',
    '    aarch64) target_arch="arm64" ;;',
    '    *) printf "unsupported architecture: %s\\n" "$CARCH" >&2 ; return 1 ;;',
    "  esac",
    '  libc=""',
    "  if command -v ldd >/dev/null 2>&1; then",
    "    if ldd --version 2>&1 | grep -qi musl; then",
    '      libc="-musl"',
    "    fi",
    "  fi",
    '  if [ -z "$libc" ] && ls /lib/ld-musl-* >/dev/null 2>&1; then',
    '    libc="-musl"',
    "  fi",
    '  base=""',
    '  if [ "$target_arch" = "x64" ]; then',
    "    if ! grep -qi avx2 /proc/cpuinfo 2>/dev/null; then",
    '      base="-baseline"',
    "    fi",
    "  fi",
    '  bin="dist/asgard-code-linux-${target_arch}${base}${libc}/bin/asgard-code"',
    '  if [ ! -f "$bin" ]; then',
    '    printf "unable to find binary for %s%s%s\\n" "$target_arch" "$base" "$libc" >&2',
    "    return 1",
    "  fi",
    '  install -Dm755 "$bin" "${pkgdir}/usr/bin/asgard-code"',
    '  ln -s asgard-code "${pkgdir}/usr/bin/asgard"',
    "}",
    "",
  ].join("\n")

  // Skip AUR and Homebrew publishing for now as this repo doesn't have access to those registries
  // To publish to AUR later, you'll need to create asgard-code and asgard-code-bin packages
  // To publish to Homebrew, you'll need to create your own homebrew tap
  console.log("Skipping AUR and Homebrew publishing - not configured for this repository")
}
