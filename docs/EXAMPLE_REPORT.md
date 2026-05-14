# Example PR Comment

# AI Change Passport

**Risk:** HIGH (72/100)

| Agent | Files | Additions | Deletions | Dependencies | Workflows | Tests | Human approval |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| codex | 12 | 410 | 95 | yes | yes | no | yes |

## Sensitive Areas

| Severity | File | Reason |
| --- | --- | --- |
| high | `.github/workflows/deploy.yml` | CI/CD workflow behavior changed |
| high | `src/auth/session.ts` | authentication or security-sensitive code changed |

## Review Guidance

- Review the generated passport before merge and confirm the changed scope matches the PR intent.
- Request focused human review for every sensitive file listed in the passport.
- Review dependency names, lockfile changes, licenses, and vulnerability impact.
- Confirm existing tests cover the changed behavior or ask for targeted tests.
- Review workflow permissions, secrets usage, third-party actions, and deployment triggers.
- Require explicit maintainer approval before merging.
