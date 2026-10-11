// Show what changed upstream in the hunk files src/vendored/sidebar copies,
// between the pinned version and a newer hunk ref. Port those changes by hand,
// keeping the "mark-read:" edits, then bump VENDORED_FROM.
//
//   bun run vendor:diff [hunk-checkout] [ref]
//   defaults: ../hunk  HEAD

import { resolve } from "node:path";

const VENDORED_FROM = "v0.23.0";

const UPSTREAM_FILES = [
  "packages/hunk/src/extensions/default/ui/sidebar/FileSidebars.tsx",
  "packages/hunk/src/ui/components/panes/FileListItem.tsx",
  "packages/hunk/src/ui/lib/files.ts",
  "packages/hunk/src/ui/lib/sidebarRenderWindow.ts",
  // Leaf helpers collected in src/vendored/sidebar/helpers.ts.
  "packages/hunk/src/core/changeset/diffPaths.ts",
  "packages/hunk/src/lib/terminalText.ts",
  "packages/hunk/src/extensions/events.ts",
  "packages/hunk/src/ui/lib/ids.ts",
  "packages/hunk/src/ui/diff/rowStyle.ts",
  "packages/hunk/src/ui/lib/text.ts",
];

const checkout = resolve(process.argv[2] ?? resolve(import.meta.dir, "../../hunk"));
const ref = process.argv[3] ?? "HEAD";

const result = Bun.spawnSync(
  ["git", "-C", checkout, "diff", "--stat", "-p", VENDORED_FROM, ref, "--", ...UPSTREAM_FILES],
  { stdout: "inherit", stderr: "inherit" },
);

if (result.exitCode !== 0) {
  process.exit(result.exitCode ?? 1);
}
