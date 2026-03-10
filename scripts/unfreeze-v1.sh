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

restore_if_exists() {
  local src="$1"
  local dest="$2"
  if [ ! -e "$src" ]; then
    echo "Skip (not found): $src"
    return
  fi

  if [ -e "$dest" ]; then
    echo "Skip (already exists): $dest"
    return
  fi

  mkdir -p "$(dirname "$dest")"
  mv "$src" "$dest"
  echo "Restored: $dest"
}

for module in "${NON_V1_API_MODULES[@]}"; do
  restore_if_exists "$ARCHIVE_API_DIR/$module" "app/api/$module"
done

for lib_file in "${NON_V1_LIB_FILES[@]}"; do
  restore_if_exists "$ARCHIVE_LIB_DIR/$lib_file" "lib/$lib_file"
done

for schema_file in "${NON_V1_SCHEMA_FILES[@]}"; do
  restore_if_exists "$ARCHIVE_SCHEMA_DIR/$schema_file" "schemas/$schema_file"
done

echo "V1 unfreeze complete."
