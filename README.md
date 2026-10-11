# hunk-mark-read

A [Hunk](https://hunk.dev) extension that lets you mark files as read during a review,
the way lumen does.

| Key or action        | Effect                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `x`                  | Mark the selected file read and jump to the next unread file. On a read file, unmark it and stay. |
| `X`                  | Jump to the next unread file, wrapping around at the end                                          |
| `H`                  | Hide or show read files                                                                           |
| Click the `✓` column | Toggle a file in the file list. On a folder, toggle every file in it.                             |

A read file gets a green `✓` in the file list, and the extension dims its diff lines. A folder gets
the `✓` once every file in it is read. The status line shows `7/12 read`, or `✓ all 12 read` when
you are done.

## When a file becomes unread again

A mark stores the file's path, its previous path, and a hash of its diff. The hash covers the whole
diff except two kinds of noise. The first is git's header lines before the first hunk, which are
`diff --git`, `index <hex>..<hex>`, `similarity index N%`, `---` and `+++`. The second is the line
numbers in real `@@ -a,b +c,d @@` headers.

Everything else counts, including odd lines in hand-edited patches. Any change to the lines you
reviewed makes the file unread again. A rebase that only moves the hunk keeps the mark, and so does
`git add` on a new file. The range, branch, and worktree are not part of the key, so a change keeps
its mark in every review that shows it.

You can't mark a file whose diff has no content, such as a file too large to diff or an untracked
binary.

## Saving

The extension saves marks automatically. Each Hunk session appends to its own JSONL file in
`$XDG_STATE_HOME/hunk-mark-read/sessions/`, which defaults to `~/.local/state/hunk-mark-read/sessions/`.
The file name is `<start>_<review>_<pid>.jsonl`. Sessions never write to each other's files. On every
load and reload, the extension reads all session files, and the latest event for each mark wins. It
deletes session files that have had no writes for 30 days.

To turn saving off, add this to your config:

```toml
[extension.hunk-mark-read]
persist = false
```

## Keys

The extension id is the folder name, `hunk-mark-read`, because Hunk names a single-entry folder
extension after its folder. The commands are `hunk-mark-read.toggle`, `hunk-mark-read.next-unread`,
and `hunk-mark-read.toggle-hidden`. You can rebind them in `~/.config/hunk/config.toml`. Hunk reads
keybindings only from the user config, not from a repo config. For example, to toggle with `space`
like lumen:

```toml
[keybindings]
"hunk-mark-read.toggle" = ["space", "x"]
```

Binding `space` takes it away from Hunk's page-down command, which keeps `PageDown` and `f`.
`hunk log` still pages with `space`. The extension can't ship `space` as its default, because Hunk
rejects extension defaults that collide with built-in keys.

## Develop

```sh
BUN_INSTALL_CACHE_DIR=$PWD/.bun-cache bun install
bun run test
bun run typecheck
bun run fmt          # or fmt:check in CI
bun run lint         # lint:fix applies safe fixes
hunk diff --extension /path/to/hunk-mark-read   # try it in any repo
```

The extension targets hunkdiff `0.23.0`, extension API `28`.

`src/vendored/sidebar/` is a copy of Hunk's built-in file list from `v0.23.0`. An extension can replace
that list but can't add anything to its rows, so this extension ships a modified copy. The copied
files are MIT licensed (© Modem Labs Inc.) and their license is in the same folder. Every local edit
has a `mark-read:` comment.

After you upgrade Hunk, `bun run vendor:diff [hunk-checkout] [ref]` shows the upstream changes to port.

## License

[MIT](LICENSE) © 2026 Bernd Kaiser
