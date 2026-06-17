# pi-secrets agent notes

## Project shape

- This is a Pi extension package. Runtime entrypoint: `src/index.ts` via `package.json` `pi.extensions`.
- Keep pure secret/redaction logic in `src/secrets.ts`; keep TUI-only code out of that module so it stays unit-testable.
- Custom TUI components must never return a rendered line wider than the `render(width)` argument.
  - Reuse `src/tui-width.ts` helpers (`fitLineToWidth`, `wrapLineToWidth`, `remainingVisibleWidth`) for every dynamic/ANSI-styled line.
  - Add a regression test using `visibleWidth()` when fixing or adding TUI rendering.

## Validation

Run both before committing release changes:

```bash
npm test
npm run check
```

For packaging confidence before publishing:

```bash
npm pack --dry-run
```

## Semantic versioning

Use SemVer for `package.json` and `package-lock.json`.

- Patch (`x.y.Z`): bug fixes, docs-only changes, test-only changes, internal refactors with no behavior/API break. Example: TUI overflow crash fix.
- Minor (`x.Y.z`): backwards-compatible user-visible features, new commands/tools/options, expanded behavior.
- Major (`X.y.z`): breaking changes to tool names/parameters/results, command behavior, storage/seed env semantics, or supported runtime expectations.

When preparing a publishable release, bump the version in the same commit as the release-ready changes unless the user asks for a separate release commit.
