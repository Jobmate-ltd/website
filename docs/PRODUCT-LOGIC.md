# Product logic on the site

The free tools (`/tools/riddor-checker`, `/tools/risk-matrix`) are the
platform's own logic, published. They must never disagree with the app, so
the code they run on is not written here: it is copied from the product
repository by a script, and every copy names where it came from.

## What is copied

| Site file | Source (Jobmate-ltd/jobsafe) | What is taken |
| --- | --- | --- |
| `lib/product-logic/riddor-knowledge.ts` | `src/lib/domain/riddor/knowledge.ts` | The whole file: `RIDDOR_CATEGORY_DEFS`, `SPECIFIED_INJURIES`, `OCC_DISEASES`, `DANGEROUS_OCCURRENCES`, `RECORD_REQUIREMENTS`, `HSE_CONTACT`, `riddorDeadline()`, `TriageAnswers`, `TriageResult`, `triage()` and the smaller lists the form uses |
| `lib/product-logic/risk-scoring.ts` | `src/lib/domain/risk/scoring.ts` | `BANDS`, `LIKELIHOOD_SCALE`, `SEVERITY_SCALE`, `HIERARCHY_DEFS`, `clamp()`, `score()`, `bandOf()`. The hazard, assessment and bowtie maths stay in the product |
| `lib/product-logic/enums.ts` | `src/lib/domain/enums.ts` | `HIERARCHY` / `Hierarchy`, `RIDDOR_CATEGORIES` / `RiddorCategory` |
| `lib/product-logic/date.ts` | `src/lib/format/date.ts` | The calendar-date helpers (`YYYY-MM-DD`, no time, no zone) that `riddorDeadline()` depends on |
| `lib/product-logic/SOURCE.json` | — | The manifest: commit, date, a hash of each source file and of the two upstream test files |

Each `.ts` file starts with a header naming the repository, the source path
and the commit SHA it was taken from. Imports are rewritten to relative
`.ts` paths so Node's test runner loads them without a bundler.

## How to re-sync

1. Check out `Jobmate-ltd/jobsafe` next to this repository (any path works;
   `../jobsafe` is the default) and pull the commit you want.
2. Run

   ```
   node scripts/sync-product-logic.mjs --from ../jobsafe
   ```

   It rewrites the four files and `SOURCE.json` and prints the commit it
   synced from.
3. Run `npm test`. `test/product-logic.test.mjs` mirrors the upstream
   `knowledge.test.ts` and the 5×5 cases of `scoring.test.ts`; if
   `SOURCE.json` shows the upstream test files changed, read them and update
   the mirror so the cases still match one for one.
4. Run `node scripts/sync-product-logic.mjs --from ../jobsafe --check`. It
   exits 1 if the local copies differ from what the script would write from
   that checkout, which is what CI should run when the product changes.
5. Commit the result. The header dates and the SHA in `SOURCE.json` are the
   audit trail for "which version of the app's logic is the checker running?"

## Rules

- Never edit a file under `lib/product-logic/` by hand. If the product's
  logic is wrong, fix it in the product and re-sync.
- Never add site-specific behaviour to these files. The tools wrap them
  (`components/tools/`), they do not extend them.
- The checker's outputs are `triage()`'s outputs. A test in
  `test/product-logic.test.mjs` walks every upstream case; a page-level test
  in `e2e/` drives the checker with the keyboard and compares the verdict
  with `triage()` for the same answers.
- The HSE contact details and deadlines come from the product's knowledge
  file. When HSE changes a number or a form, it changes in the product first.

## Synced

See `lib/product-logic/SOURCE.json` for the current commit and date.
