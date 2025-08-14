// tools/fabricate-slice.ts
// Fabricates from a single step slice, with "prepend commented stub" behavior when targets already exist.
//
// Usage:
//   ts-node tools/fabricate-slice.ts --slice ./context/steps/S0/S0.json --root . --context ./context/steps
//
// Flags:
//   --slice    Path to a step slice file created by step-slicer.ts (required)
//   --root     Filesystem root for writing layout/files (default: process.cwd())
//   --context  Base context directory that contains per-step folders (default: ./context/steps)

import * as fs from "fs";
import * as path from "path";

type AnyRec = Record<string, any>;

function readJSON(p: string): AnyRec {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function nowIsoUTC(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
}

function commentBlock(text: string, linePrefix: string): string {
  if (!text.endsWith("\n")) text += "\n";
  return text.split("\n").map(l => (l.length ? `${linePrefix}${l}` : linePrefix.trimEnd())).join("\n") + "\n";
}

function selectCommentPrefix(commentStyles: AnyRec, language?: string): string {
  if (language && commentStyles?.[language]?.line_prefix) {
    return String(commentStyles[language].line_prefix);
  }
  // sensible defaults
  if (language === "typescript" || language === "javascript") return "// ";
  if (language === "python") return "# ";
  if (language === "text" || language === "markdown") return "# ";
  return "# ";
}

function looksDoubleEscaped(s: string): boolean {
  if (typeof s !== "string" || !s) return false;
  const hasEsc = s.includes("\\n") || s.includes('\\"') || s.includes("\\'");
  const hasRealNL = s.includes("\n");
  return hasEsc && !hasRealNL;
}

function maybeUnescape(s: string): string {
  if (typeof s !== "string") return String(s ?? "");
  if (!looksDoubleEscaped(s)) return s;
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, "\"")
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

function buildHeader(prefix: string, version: string, targetFile: string, prompt?: string): string {
  const lines = [
    "FABRICATOR PREPEND — DO NOT REMOVE",
    `Timestamp: ${nowIsoUTC()}`,
    `Spec Version: ${version}`,
    `Target File: ${targetFile}`
  ];
  let out = commentBlock(lines.join("\n"), prefix);
  if (prompt && prompt.trim()) {
    out += commentBlock("PROMPT:\n" + prompt.trim(), prefix);
  }
  out += commentBlock("-".repeat(72), prefix);
  return out;
}

function fabricateFromSlice(slicePath: string, rootDir: string, contextBase: string) {
  const slice = readJSON(slicePath);
  const version = String(slice.version ?? "1.0");
  const commentStyles = slice?.runtime?.comment_styles ?? {};
  const step = slice.step ?? {};
  const id = String(step.id ?? "").trim();
  if (!id) throw new Error("Slice is missing step.id");

  // Resolve the step's context dir for instructions
  const stepContextDir = path.join(contextBase, id);
  ensureDir(stepContextDir);

  const layout: any[] = Array.isArray(step?.payload?.layout) ? step.payload.layout : [];
  const files: AnyRec[] = Array.isArray(step?.payload?.files) ? step.payload.files : [];

  // 1) Create layout directories
  for (const entry of layout) {
    const rel = typeof entry === "string" ? entry : String(entry?.path ?? "");
    if (!rel) continue;
    ensureDir(path.join(rootDir, rel));
  }

  const created: string[] = [];
  const prepended: string[] = [];
  const skippedNonText: string[] = [];

  // 2/3) Create or prepend files
  for (const f of files) {
    const rel = String(f?.path ?? "").trim();
    if (!rel) continue;

    const language = f.language as string | undefined;
    const prefix = selectCommentPrefix(commentStyles, language);
    const absTarget = path.join(rootDir, rel);
    ensureDir(path.dirname(absTarget));

    let content = f?.content ?? "";
    if (content == null) content = "";
    if (typeof content !== "string") content = JSON.stringify(content, null, 2);
    content = maybeUnescape(content);
    if (!content.endsWith("\n")) content += "\n";

    const prompt = typeof f?.prompt === "string" ? maybeUnescape(f.prompt) : undefined;

    if (!fs.existsSync(absTarget)) {
      // new file → raw content (keeps file runnable)
      fs.writeFileSync(absTarget, content, "utf-8");
      created.push(absTarget);
    } else {
      // existing file → prepend header + commented stub + note + original
      let original: string;
      try {
        original = fs.readFileSync(absTarget, "utf-8");
      } catch {
        skippedNonText.push(absTarget);
        continue;
      }
      const header = buildHeader(prefix, version, absTarget, prompt);
      let commentedStub = commentBlock("STUB PAYLOAD (commented copy follows)\n", prefix);
      commentedStub += commentBlock(content, prefix);
      const note = commentBlock(
        "NOTE: Existing file detected. The fabricator header and commented stub were prepended above.\n" +
          "Original content begins below.",
        prefix
      );
      const newText = header + commentedStub + note + original;
      fs.writeFileSync(absTarget, newText, "utf-8");
      prepended.push(absTarget);
    }
  }

  // instructions.md — (re)generate to match this slice
  const instrLines: string[] = [];
  instrLines.push(`# ${id}: ${step.title ?? ""}`.trim());
  if (step.overview) {
    instrLines.push("", "## Overview", step.overview);
  }
  if (Array.isArray(step.instructions) && step.instructions.length) {
    instrLines.push("", "## Instructions", ...step.instructions.map((i: string) => `- ${i}`));
  }
  if (Array.isArray(step.checklist) && step.checklist.length) {
    instrLines.push("", "## Checklist", ...step.checklist.map((i: string) => `- [ ] ${i}`));
  }
  if (Array.isArray(step.validators) && step.validators.length) {
    instrLines.push("", "## Validators", "```json", JSON.stringify(step.validators, null, 2), "```");
  }
  if (step.cease_work_when) {
    instrLines.push("", "## Cease Work When", step.cease_work_when);
  }
  instrLines.push(
    "",
    "## Fabrication Summary",
    "```json",
    JSON.stringify({ created, prepended, skippedNonText }, null, 2),
    "```"
  );
  fs.writeFileSync(path.join(stepContextDir, "instructions.md"), instrLines.join("\n") + "\n", "utf-8");

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      { created_directories: layout.length, created_files: created.length, prepended_files: prepended.length, skipped_non_text: skippedNonText },
      null,
      2
    )
  );
}

function main() {
  const argv = process.argv.slice(2);
  const slice = argv.includes("--slice") ? argv[argv.indexOf("--slice") + 1] : "";
  if (!slice) {
    // eslint-disable-next-line no-console
    console.error("Missing --slice <path-to-step-slice.json>");
    process.exit(1);
  }
  const root = argv.includes("--root") ? argv[argv.indexOf("--root") + 1] : process.cwd();
  const context = argv.includes("--context") ? argv[argv.indexOf("--context") + 1] : "./context/steps";

  fabricateFromSlice(path.resolve(slice), path.resolve(root), path.resolve(context));
}

main();
