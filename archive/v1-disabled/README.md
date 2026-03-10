# V1 Freeze Archive

This folder stores routes and backend modules that are intentionally disabled
for V1.

## Active V1 Modules

- chart-of-accounts
- customers
- departments
- employees
- gl-codings
- invoices
- payments
- sales-invoices
- transactions
- vendors

Address is handled as nested data under customer/vendor and is not a direct
route module.

## Commands

- Freeze non-V1 modules:
  - `bash scripts/freeze-v1.sh`
- Restore frozen modules:
  - `bash scripts/unfreeze-v1.sh`

## Notes

- Frozen files are moved out of `app/api`, `lib`, and `schemas`.
- `tsconfig.json` excludes `archive/**/*` so TypeScript ignores archived files.
