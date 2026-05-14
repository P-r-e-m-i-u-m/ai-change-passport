# AI Change Passport Specification

This document describes the initial `0.1` passport schema.

## Goals

The passport should provide a compact, verifiable record of an AI-assisted code change.

It should help reviewers answer:

- what changed
- whether sensitive areas were touched
- whether dependencies changed
- whether tests changed
- whether explicit human approval is required
- whether the report changed after generation

## Schema

```ts
interface ChangePassport {
  schemaVersion: "0.1";
  generatedAt: string;
  repository?: string;
  base: string;
  head: string;
  agent: string;
  summary: Summary;
  sensitiveTouches: SensitiveTouch[];
  changedFiles: ChangedFile[];
  recommendations: string[];
  signature: Signature;
}
```

## Signature

The signature is a SHA-256 hash over the passport body before the `signature` field is added.

This is not a cryptographic identity proof. It is a tamper-evident checksum for the generated metadata.

Future versions may support key-based signing.

## Risk Model

Risk is scored from:

- total changed files
- total line churn
- dependency changes
- missing test changes
- sensitive file categories

Risk levels:

- `low`
- `medium`
- `high`
- `critical`

## Human Approval

`humanApprovalRequired` is true when:

- risk is `high`
- risk is `critical`
- CI/CD workflow files changed

Teams can use this field as a branch protection or review policy signal.
