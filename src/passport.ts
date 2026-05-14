import { createHash } from "node:crypto";
import { classifySensitiveTouches, hasDependencyChanges, hasTestChanges, hasWorkflowChanges } from "./classifier.js";
import { getDiffFiles, getRepository } from "./git.js";
import { scoreChange } from "./risk.js";
import type { ChangePassport, PassportInput } from "./types.js";

export function generatePassport(input: PassportInput): ChangePassport {
  const cwd = input.cwd ?? process.cwd();
  const diff = getDiffFiles(input.base, input.head, cwd);
  const sensitiveTouches = classifySensitiveTouches(diff.files);
  const dependencyChanges = hasDependencyChanges(diff.files);
  const workflowChanges = hasWorkflowChanges(diff.files);
  const testsChanged = hasTestChanges(diff.files);
  const risk = scoreChange(diff.files, sensitiveTouches, dependencyChanges, testsChanged);
  const humanApprovalRequired = risk.risk === "high" || risk.risk === "critical" || workflowChanges;

  const passportWithoutSignature: Omit<ChangePassport, "signature"> = {
    schemaVersion: "0.1",
    generatedAt: new Date().toISOString(),
    repository: getRepository(cwd),
    base: diff.base,
    head: diff.head,
    agent: input.agent,
    summary: {
      risk: risk.risk,
      score: risk.score,
      changedFiles: diff.files.length,
      additions: diff.files.reduce((sum, file) => sum + file.additions, 0),
      deletions: diff.files.reduce((sum, file) => sum + file.deletions, 0),
      dependencyChanges,
      workflowChanges,
      testsChanged,
      humanApprovalRequired
    },
    sensitiveTouches,
    changedFiles: diff.files,
    recommendations: buildRecommendations(risk.risk, sensitiveTouches.length, dependencyChanges, testsChanged, workflowChanges)
  };

  return {
    ...passportWithoutSignature,
    signature: {
      algorithm: "sha256",
      value: sign(passportWithoutSignature)
    }
  };
}

export function sign(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function buildRecommendations(risk: string, sensitiveCount: number, dependencyChanges: boolean, testsChanged: boolean, workflowChanges: boolean): string[] {
  const recommendations = ["Review the generated passport before merge and confirm the changed scope matches the PR intent."];
  if (sensitiveCount > 0) recommendations.push("Request focused human review for every sensitive file listed in the passport.");
  if (dependencyChanges) recommendations.push("Review dependency names, lockfile changes, licenses, and vulnerability impact.");
  if (!testsChanged) recommendations.push("Confirm existing tests cover the changed behavior or ask for targeted tests.");
  if (workflowChanges) recommendations.push("Review workflow permissions, secrets usage, third-party actions, and deployment triggers.");
  if (risk === "critical" || risk === "high") recommendations.push("Require explicit maintainer approval before merging.");
  return recommendations;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
}
