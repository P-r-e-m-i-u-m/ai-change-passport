import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { writeFile } from "node:fs/promises";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { upsertComment } from "./github-comment.js";
import { generatePassport } from "./passport.js";
import { renderMarkdown, renderText } from "./report.js";

try {
  const pullRequest = github.context.payload.pull_request;
  const base = core.getInput("base") || pullRequest?.base?.sha || undefined;
  const head = core.getInput("head") || pullRequest?.head?.sha || undefined;
  const agent = core.getInput("agent") || "unknown";
  const output = core.getInput("output") || ".ai-passport/report.json";
  const comment = core.getBooleanInput("comment");
  const token = core.getInput("token");

  const passport = generatePassport({ base, head, agent });
  const markdown = renderMarkdown(passport);

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(passport, null, 2)}\n`, "utf8");

  core.info(renderText(passport));
  core.setOutput("risk-score", String(passport.summary.score));
  core.setOutput("risk-level", passport.summary.risk);
  core.setOutput("signature", passport.signature.value);
  core.setOutput("output", output);
  await core.summary.addRaw(markdown).write();

  if (comment && token) {
    await upsertComment(token, markdown);
  }
} catch (error) {
  core.setFailed(error instanceof Error ? error.message : String(error));
}
