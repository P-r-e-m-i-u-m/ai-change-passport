import type { ChangePassport, RiskLevel } from "./types.js";

const marker = "<!-- ai-change-passport -->";

export function renderMarkdown(passport: ChangePassport): string {
  const sensitiveRows = passport.sensitiveTouches.length
    ? passport.sensitiveTouches.map((touch) => `| ${touch.severity} | \`${touch.path}\` | ${escapePipes(touch.reason)} |`).join("\n")
    : "| low | - | No sensitive areas detected |";

  const recommendations = passport.recommendations.map((item) => `- ${item}`).join("\n");

  return [
    marker,
    "# AI Change Passport",
    "",
    `**Risk:** ${label(passport.summary.risk)} (${passport.summary.score}/100)`,
    "",
    "| Agent | Files | Additions | Deletions | Dependencies | Workflows | Tests | Human approval |",
    "| --- | ---: | ---: | ---: | --- | --- | --- | --- |",
    `| ${passport.agent} | ${passport.summary.changedFiles} | ${passport.summary.additions} | ${passport.summary.deletions} | ${yesNo(passport.summary.dependencyChanges)} | ${yesNo(passport.summary.workflowChanges)} | ${yesNo(passport.summary.testsChanged)} | ${yesNo(passport.summary.humanApprovalRequired)} |`,
    "",
    "## Sensitive Areas",
    "",
    "| Severity | File | Reason |",
    "| --- | --- | --- |",
    sensitiveRows,
    "",
    "## Review Guidance",
    "",
    recommendations,
    "",
    "## Verification",
    "",
    `- Schema: \`${passport.schemaVersion}\``,
    `- Base: \`${passport.base}\``,
    `- Head: \`${passport.head}\``,
    `- Signature: \`${passport.signature.algorithm}:${passport.signature.value}\``,
    "",
    "_This passport is deterministic metadata about the change. It does not send source code to an AI provider._"
  ].join("\n");
}

export function renderText(passport: ChangePassport): string {
  return [
    `AI Change Passport: ${passport.summary.risk.toUpperCase()} (${passport.summary.score}/100)`,
    `Agent: ${passport.agent}`,
    `Files: ${passport.summary.changedFiles}, +${passport.summary.additions}, -${passport.summary.deletions}`,
    `Dependencies changed: ${yesNo(passport.summary.dependencyChanges)}`,
    `Workflows changed: ${yesNo(passport.summary.workflowChanges)}`,
    `Tests changed: ${yesNo(passport.summary.testsChanged)}`,
    `Human approval required: ${yesNo(passport.summary.humanApprovalRequired)}`,
    `Signature: ${passport.signature.value}`
  ].join("\n");
}

function label(risk: RiskLevel): string {
  return risk.toUpperCase();
}

function yesNo(value: boolean): string {
  return value ? "yes" : "no";
}

function escapePipes(value: string): string {
  return value.replaceAll("|", "\\|");
}
