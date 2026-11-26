# Acceptance gate — REDLINE

## Automated acceptance
- Run `node --test`.
- CI browser smoke: desktop 1440×900, mobile 390×844, sidebar, one visible page, no horizontal page overflow, no uncaught browser errors, core product flow. External network is blocked in this test; it does not verify third-party integration.
- Production: verify exact deployed source and HTTP responses; manually repeat product flow on public domain.

## Required live evidence (NOT VERIFIED until demonstrated)
Register, build and install the real Forge application on an authorized Jira Cloud development site; verify live issue metadata and real release evidence. Local model readiness is not production authorization.

## Release criteria
- GitHub Actions green for exact release commit.
- Manual visual review on desktop and mobile, genuine platform integration and independent evidence.
- No paid infrastructure, no secret collection, no mainnet. Do not submit as complete while any live requirement remains open.
