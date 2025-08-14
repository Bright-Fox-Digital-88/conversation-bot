// tools/step-slicer.ts
// Slices a monolithic fabrication spec into per-step JSON files and writes instructions.md beside each slice.
//
// Usage:
//   ts-node tools/step-slicer.ts --spec ./inst.json --out ./context/steps
//
// Flags:
//   --spec    Path to the monolithic JSON spec (default: ./inst.json)
//   --out     Output directory for /<id>/<id>.json and instructions.md (default: ./context/steps)

import * as fs from "fs";
import * as path from "path";

type AnyRec = Record<string, any>;

function readJSON(p: string): AnyRec {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJSON(p: string, data: unknown) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}

function md(lines: string[]) {
  return lines.join("\n") + "\n";
}

function makeInstructions(step: AnyRec): string {
  const lines: string[] = [];
  lines.push(`# ${step.id}: ${step.title ?? ""}`.trim());
  if (step.overview) {
    lines.push("", "## Overview", step.overview);
  }
  if (step.priority) {
    lines.push(
      "",
      "## Priority",
      "```json",
      JSON.stringify(step.priority, null, 2),
      "```"
    );
  }
  if (Array.isArray(step.instructions) && step.instructions.length) {
    lines.push("", "## Instructions", ...step.instructions.map((i: string) => `- ${i}`));
  }
  if (Array.isArray(step.checklist) && step.checklist.length) {
    lines.push("", "## Checklist", ...step.checklist.map((i: string) => `- [ ] ${i}`));
  }
  if (Array.isArray(step.validators) && step.validators.length) {
    lines.push(
      "",
      "## Validators",
      "```json",
      JSON.stringify(step.validators, null, 2),
      "```"
    );
  }
  if (step.cease_work_when) {
    lines.push("", "## Cease Work When", step.cease_work_when);
  }
  // payload manifest
  const layout = step?.payload?.layout ?? [];
  const files = step?.payload?.files ?? [];
  if (layout.length || files.length) {
    lines.push("", "## Payload Manifest");
    if (layout.length) {
      lines.push("", "### Layout (directories to create)", "```json", JSON.stringify(layout, null, 2), "```");
    }
    if (files.length) {
      lines.push("", "### Files (targets to create/prepend)", "```json", JSON.stringify(files.map((f: AnyRec) => f.path), null, 2), "```");
    }
  }
  return md(lines);
}

function main() {
  const argv = process.argv.slice(2);
  const specPath = argv.includes("--spec") ? argv[argv.indexOf("--spec") + 1] : "./inst.json";
  const outDir = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : "./context/steps";

  const spec = readJSON(specPath);
  const steps: AnyRec[] = Array.isArray(spec.steps) ? spec.steps : [];
  const runtime = (spec.runtime ?? {}) as AnyRec; // carry comment_styles for downstream
  const comment_styles = (runtime.comment_styles ?? {}) as AnyRec;

  ensureDir(outDir);

  for (const step of steps) {
    const id = String(step.id ?? "").trim();
    if (!id) continue;

    const stepDir = path.join(outDir, id);
    ensureDir(stepDir);

    // Build the slice (include a tiny runtime envelope to preserve comment styles + version)
    const slice = {
      version: spec.version ?? "1.0",
      runtime: { comment_styles },
      step
    };

    const slicePath = path.join(stepDir, `${id}.json`);
    writeJSON(slicePath, slice);

    // instructions.md
    const instrPath = path.join(stepDir, "instructions.md");
    fs.writeFileSync(instrPath, makeInstructions(step), "utf-8");
    // eslint-disable-next-line no-console
    console.log(`[slice] ${slicePath}`);
  }

  // eslint-disable-next-line no-console
  console.log("✅ Done slicing.");
}

main();
