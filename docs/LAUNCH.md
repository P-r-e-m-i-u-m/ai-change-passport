# Launch Kit

## One-line Pitch

AI Change Passport creates an SBOM-style provenance report for AI-assisted pull requests.

## Short Pitch

AI coding agents are becoming real contributors. AI Change Passport gives each agent-assisted PR a signed JSON report and PR comment showing what changed, whether sensitive areas were touched, whether dependencies or workflows changed, whether tests changed, and whether human approval is required.

## LinkedIn / X / Discord Post

I built **AI Change Passport**.

It is a GitHub Action + CLI that creates an SBOM-style provenance report for AI-assisted pull requests.

It answers:

- Which agent touched this PR?
- Did it change auth, CI/CD, infra, env files, or payments?
- Did dependencies change?
- Did tests change?
- Does this need explicit human approval?
- Can we keep a signed audit record after merge?

Repo:
https://github.com/P-r-e-m-i-u-m/ai-change-passport

Feedback is welcome from maintainers, security engineers, and anyone using AI coding agents in real repositories.

If it looks useful, a star helps me understand whether to keep building it.

## Reddit-style Post

Title:

I built a GitHub Action that creates a signed "passport" for AI-assisted pull requests

Body:

AI coding agents can now open meaningful PRs, but reviewing them still feels messy. I wanted a small GitHub-native artifact that records what the agent changed and whether a human should slow down before merge.

I built AI Change Passport. It generates a signed JSON report and PR comment with:

- agent name
- changed files and line counts
- sensitive file touches
- dependency changes
- workflow changes
- test-change signal
- risk score
- human approval flag

It does not send source code to an AI provider. It only reads Git diff metadata.

Repo:
https://github.com/P-r-e-m-i-u-m/ai-change-passport

I would love feedback on the schema and what metadata maintainers would want before trusting AI-authored PRs.

## Communities To Share Carefully

- GitHub Community Discussions
- Dev.to
- Hashnode
- r/github
- r/opensource
- r/devops
- r/cybersecurity
- AI engineering Discord communities

Post once per community and adapt the wording to the rules. Do not ask for empty stars.
