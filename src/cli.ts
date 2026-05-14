import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Command } from "commander";
import pc from "picocolors";
import { generatePassport } from "./passport.js";
import { renderMarkdown, renderText } from "./report.js";

const program = new Command()
  .name("ai-change-passport")
  .description("Generate a verifiable passport for an AI-assisted code change.")
  .option("--base <ref>", "Base ref, branch, or SHA")
  .option("--head <ref>", "Head ref, branch, or SHA", "HEAD")
  .option("--agent <name>", "Agent or assistant name", "unknown")
  .option("--cwd <path>", "Repository path", process.cwd())
  .option("--output <path>", "Write JSON passport to this file")
  .option("--format <format>", "Output format: text, markdown, or json", "text")
  .parse(process.argv);

const options = program.opts<{
  base?: string;
  head?: string;
  agent: string;
  cwd: string;
  output?: string;
  format: "text" | "markdown" | "json";
}>();

try {
  const passport = generatePassport({
    base: options.base,
    head: options.head,
    agent: options.agent,
    cwd: options.cwd
  });

  if (options.output) {
    const outputPath = resolve(options.cwd, options.output);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(passport, null, 2)}\n`, "utf8");
  }

  const output =
    options.format === "json" ? JSON.stringify(passport, null, 2) :
    options.format === "markdown" ? renderMarkdown(passport) :
    renderText(passport);

  const color = passport.summary.risk === "critical" ? pc.red : passport.summary.risk === "high" ? pc.magenta : passport.summary.risk === "medium" ? pc.yellow : pc.green;
  console.log(options.format === "text" ? color(output) : output);
} catch (error) {
  console.error(pc.red(error instanceof Error ? error.message : String(error)));
  process.exitCode = 2;
}
