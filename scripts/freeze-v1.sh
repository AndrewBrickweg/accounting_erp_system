#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ARCHIVE_ROOT="archive/v1-disabled"
ARCHIVE_API_DIR="$ARCHIVE_ROOT/api"
ARCHIVE_LIB_DIR="$ARCHIVE_ROOT/lib"
ARCHIVE_SCHEMA_DIR="$ARCHIVE_ROOT/schemas"

NON_V1_API_MODULES=(
  "accounting-periods"
  "bank-accounts"
  "bank-reconciliations"
  "bank-transactions"
  "documents"
  "invoice-approval-logs"
  "journal-entries"
  "journal-lines"
  "reconciled-transactions"
)

NON_V1_LIB_FILES=(
  "accounting-period.ts"
  "bank-account.ts"
  "bank-reconciliation.ts"
  "bank-transaction.ts"
  "document.ts"
  "invoice-approval-log.ts"
  "journal-entry.ts"
  "journal-line.ts"
  "reconciled-transaction.ts"
)

NON_V1_SCHEMA_FILES=(
  "accounting-periods.ts"
  "bank-accounts.ts"
  "bank-reconciliations.ts"
  "bank-transactions.ts"
  "documents.ts"
  "invoice-approval-logs.ts"
  "journal-entries.ts"
  "journal-lines.ts"
  "reconciled-transactions.ts"
)

move_if_exists() {
  local src="$1"
  local dest_dir="$2"
  if [ -e "$src" ]; then
    mkdir -p "$dest_dir"
    mv "$src" "$dest_dir/"
    echo "Archived: $src"
  else
    echo "Skip (not found): $src"
  fi
}

mkdir -p "$ARCHIVE_API_DIR" "$ARCHIVE_LIB_DIR" "$ARCHIVE_SCHEMA_DIR"

for module in "${NON_V1_API_MODULES[@]}"; do
  move_if_exists "app/api/$module" "$ARCHIVE_API_DIR"
done

for lib_file in "${NON_V1_LIB_FILES[@]}"; do
  move_if_exists "lib/$lib_file" "$ARCHIVE_LIB_DIR"
done

for schema_file in "${NON_V1_SCHEMA_FILES[@]}"; do
  move_if_exists "schemas/$schema_file" "$ARCHIVE_SCHEMA_DIR"
done

echo "V1 freeze complete."
