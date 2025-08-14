# Prompt 1 — StepBundle Generator (Plan + Stubs for All Steps)

**SYSTEM**
```
You are designing an ordered plan for implementing new or updated code in an existing codebase.
You will output a single JSON object containing all steps, in order, with stub code for every required file in each step.

Step ordering priorities:
1) Theming — group closely related files/functions together
2) Necessity — core building blocks first
3) Complexity — higher complexity appears later
4) Iterative Operability — earlier steps should yield usable features even if later steps are skipped

Rules:
- Each step must have:
  * id: deterministic ID like S0, S1, S2...
  * title, overview
  * priority: scores for theming, necessity, complexity, iterative_operability, composite (weighted), rationale
  * payload: directories to create and files to create/prepend with stub code
  * instructions: concise, step-specific goals
  * checklist: measurable pass/fail items
  * validators: machine-run import/grep checks for this step only
  * cease_work_when: clear stopping condition

- Stubs must include:
  * Correct imports
  * Function/class signatures
  * Typed parameters & returns
  * Minimal docstring or TODO comment describing intended logic
  * No business logic

- Payload format:
  * If file does not exist → write content exactly
  * If file exists → prepend content as commented lines
  * Use provided comment_styles per language

- JSON only. No explanations.
```

**USER INPUT**
- Project context (functions/files to add or edit, language constraints, allowed imports, etc.)
- Your theming/necessity/complexity/iterative operability rules (if not default)

**OUTPUT SCHEMA**
```json
{
  "version": "1.0",
  "runtime": {
    "conventions": { "path_separator": "/", "root": ".", "encoding": "utf-8" },
    "comment_styles": {
      "python": { "line_prefix": "# " },
      "typescript": { "line_prefix": "// " },
      "text": { "line_prefix": "# " }
    },
    "apply_rules": {
      "if_file_missing": "write_content_exactly",
      "if_file_exists": "prepend_as_commented_block",
      "final_report": true
    }
  },
  "steps": [
    {
      "id": "S0",
      "title": "string",
      "overview": "string",
      "priority": {
        "theming": "number",
        "necessity": "number",
        "complexity": "number",
        "iterative_operability": "number",
        "composite": "number",
        "rationale": "string"
      },
      "payload": {
        "layout": ["string"],
        "files": [
          {
            "path": "string",
            "language": "string",
            "content": "string"
          }
        ]
      },
      "instructions": ["string"],
      "checklist": ["string"],
      "validators": [
        {
          "type": "string",
          "target": "string",
          "symbol": "string",
          "path": "string",
          "pattern": "string"
        }
      ],
      "cease_work_when": "string"
    }
  ]
}
```

**MINIMAL EXAMPLE OUTPUT**
```json
{
  "version": "1.0",
  "runtime": {
    "conventions": { "path_separator": "/", "root": ".", "encoding": "utf-8" },
    "comment_styles": { "python": { "line_prefix": "# " } },
    "apply_rules": { "if_file_missing": "write_content_exactly", "if_file_exists": "prepend_as_commented_block", "final_report": true }
  },
  "steps": [
    {
      "id": "S0",
      "title": "Contracts & Scaffold",
      "overview": "Create base models and entrypoints.",
      "priority": { "theming": 0.9, "necessity": 1.0, "complexity": 0.1, "iterative_operability": 0.8, "composite": 0.88, "rationale": "Core contracts, low complexity" },
      "payload": {
        "layout": ["src", "src/models"],
        "files": [
          {
            "path": "src/models/params.py",
            "language": "python",
            "content": "from dataclasses import dataclass\n\n@dataclass\nclass GeneratorParams:\n    target_gb: float\n    seed: int | None = None\n\n# TODO: Add validation in __post_init__"
          }
        ]
      },
      "instructions": ["Define GeneratorParams dataclass with documented fields."],
      "checklist": ["params dataclass exists"],
      "validators": [{ "type": "python_import", "target": "src/models/params.py", "symbol": "GeneratorParams" }],
      "cease_work_when": "Checklist passes"
    }
  ]
}
```