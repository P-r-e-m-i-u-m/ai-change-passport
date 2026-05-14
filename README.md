# AI Change Passport

AI Change Passport creates a verifiable record for AI-assisted pull requests.

It answers the question reviewers, maintainers, and security teams are starting to ask:

> What did the agent change, how risky is it, and what needs human approval before merge?

## Why This Exists

AI coding agents are becoming real contributors to software projects. They can edit code, change dependencies, touch CI/CD, modify authentication logic, and open pull requests quickly.

That speed is useful, but it creates a review gap:

- Which agent worked on this change?
- Did the PR touch security-sensitive files?
- Did dependencies or workflows change?
- Were tests added or changed?
- Should a human explicitly approve the risky parts?
- Can we keep a stable audit record after the PR is merged?

AI Change Passport is a small, GitHub-native way to create that record.

Think of it as an **SBOM-style passport for AI-assisted code changes**.

## What It Generates

```json
{
  "schemaVersion": "0.1",
  "agent": "codex",
  "summary": {
    "risk": "high",
    "score": 72,
    "changedFiles": 12,
    "dependencyChanges": true,
    "workflowChanges": true,
    "testsChanged": false,
    "humanApprovalRequired": true
  },
  "sensitiveTouches": [
    {
      "path": ".github/workflows/deploy.yml",
      "reason": "CI/CD workflow behavior changed",
      "severity": "high"
    }
  ],
  "signature": {
    "algorithm": "sha256",
    "value": "..."
  }
}
```

## Quick Start

```bash
npm install -D github:P-r-e-m-i-u-m/ai-change-passport
npx ai-change-passport --base origin/main --head HEAD --agent codex
```

Write the passport to disk:

```bash
npx ai-change-passport \
  --base origin/main \
  --head HEAD \
  --agent codex \
  --output .ai-passport/report.json
```

Markdown output:

```bash
npx ai-change-passport --base origin/main --head HEAD --agent codex --format markdown
```

## GitHub Action

```yaml
name: AI Change Passport

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

permissions:
  contents: read
  pull-requests: write

jobs:
  passport:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: P-r-e-m-i-u-m/ai-change-passport@v0
        with:
          agent: codex
          comment: true
```

## What It Detects

AI Change Passport reviews the diff metadata and flags:

- CI/CD workflow changes
- auth, session, security, crypto, RBAC, and permission changes
- infrastructure and deployment changes
- Docker/container changes
- environment or secret-related files
- payment or billing-related files
- dependency manifest and lockfile changes
- whether test files changed

It does not send source code to an AI provider.

## Review Policy Ideas

For personal projects:

```yaml
with:
  agent: codex
  comment: true
```

For open-source projects:

```yaml
with:
  agent: copilot
  comment: true
```

For production repositories, use the passport as a required review artifact:

- require human review when `humanApprovalRequired` is `true`
- require security review for `high` or `critical`
- archive `.ai-passport/report.json` as a build artifact

## Design Goals

- **Explainable:** reviewers should understand the report in seconds.
- **Deterministic:** the passport is generated from Git metadata, not model guesses.
- **Portable:** JSON output can be stored, signed, uploaded, or checked later.
- **Respectful:** the tool records risk without accusing contributors.
- **GitHub-native:** works as both a CLI and a GitHub Action.

## Roadmap

- artifact upload example
- SARIF output
- policy file support
- PR review approval checks
- stronger provenance metadata
- SLSA/in-toto compatibility research

## License

MIT
