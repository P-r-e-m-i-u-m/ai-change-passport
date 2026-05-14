import { execFileSync } from "node:child_process";
import type { ChangedFile } from "./types.js";

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trimEnd();
}

export function getRepository(cwd: string): string | undefined {
  try {
    const remote = git(["remote", "get-url", "origin"], cwd);
    const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

export function getDefaultBase(cwd: string): string {
  for (const candidate of ["origin/main", "origin/master", "main", "master"]) {
    try {
      git(["rev-parse", "--verify", candidate], cwd);
      return candidate;
    } catch {
      // Continue through common defaults.
    }
  }
  return "HEAD~1";
}

export function getDiffFiles(baseInput: string | undefined, headInput: string | undefined, cwd: string): { base: string; head: string; files: ChangedFile[] } {
  const base = baseInput || process.env.PR_BASE_SHA || process.env.GITHUB_BASE_REF || getDefaultBase(cwd);
  const head = headInput || process.env.PR_HEAD_SHA || process.env.GITHUB_SHA || "HEAD";
  const nameStatus = git(["diff", "--name-status", "--find-renames", `${base}...${head}`], cwd);
  const numstat = git(["diff", "--numstat", "--find-renames", `${base}...${head}`], cwd);
  const stats = parseNumstat(numstat);

  const files = nameStatus
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [statusRaw, ...parts] = line.split("\t");
      const path = normalizePath(parts);
      const fileStats = stats.get(path) ?? { additions: 0, deletions: 0 };
      return {
        path,
        additions: fileStats.additions,
        deletions: fileStats.deletions,
        status: mapStatus(statusRaw[0])
      };
    });

  return { base, head, files };
}

function parseNumstat(output: string): Map<string, { additions: number; deletions: number }> {
  const stats = new Map<string, { additions: number; deletions: number }>();
  for (const line of output.split("\n").filter(Boolean)) {
    const [additionsRaw, deletionsRaw, ...parts] = line.split("\t");
    stats.set(normalizePath(parts), {
      additions: Number.parseInt(additionsRaw, 10) || 0,
      deletions: Number.parseInt(deletionsRaw, 10) || 0
    });
  }
  return stats;
}

function normalizePath(parts: string[]): string {
  return parts.at(-1) ?? "";
}

function mapStatus(status: string): ChangedFile["status"] {
  if (status === "A") return "added";
  if (status === "M") return "modified";
  if (status === "D") return "deleted";
  if (status === "R") return "renamed";
  return "unknown";
}
