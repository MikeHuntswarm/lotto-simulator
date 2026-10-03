#!/usr/bin/env bash
# The gate for this repo. Runs install -> lint -> test -> build in order and stops at the first failure.
#
# This is the ONE command that decides whether work may ship - locally AND in CI
# (.github/workflows/verify.yml runs this same script). Keeping a single script
# is what stops the two from drifting apart. See docs/WORKFLOW.md.
#
# Usage:  bash scripts/verify.sh
set -uo pipefail

cd "$(dirname "$0")/.."

FAILED=""

# Each stage is a function so its body is real shell - no nested quoting, and
# variables like $PY stay inside the stage instead of expanding at the call site.
stage_install() {
  if [ -d "node_modules" ]; then
    echo "  (node_modules present - skipping install)"
  else
    npm ci
  fi
}

stage_lint() {
  npm run lint
}

stage_test() {
  npm test
}

stage_build() {
  npm run build
}

# Stage bodies above; this is the run order.
STAGES=(install lint test build)

for label in "${STAGES[@]}"; do
  echo ""
  echo "=== $label"
  # subshell per stage: a stage may `cd` (e.g. into backend/) and that must not
  # leak into the stages after it
  if ( "stage_$label" ); then
    echo "--- $label: ok"
  else
    code=$?
    echo "--- $label: FAILED (exit $code)"
    FAILED="$label"
    break
  fi
done

echo ""
if [ -n "$FAILED" ]; then
  echo "=== VERIFY: RED - first failing stage: $FAILED"
  exit 1
fi
echo "=== VERIFY: GREEN - all 4 stages passed"
