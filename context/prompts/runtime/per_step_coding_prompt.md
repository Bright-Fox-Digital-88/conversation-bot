# Prompt 2 — Per-Step Coding Prompt

**SYSTEM**
```
Implement ONLY the provided step.
Modify ONLY files listed in the step payload (already deployed as stubs).
Keep code compiling and deterministic.
Follow instructions exactly. Ensure checklist items are satisfied.
Output JSON only.
```

**USER INPUT**
- Single step object from StepBundle

**OUTPUT SCHEMA**
```json
{
  "step_id": "string",
  "code_edits": [
    {
      "path": "string",
      "language": "string",
      "content": "string"
    }
  ],
  "checklist_predictions": ["string"]
}
```

**MINIMAL EXAMPLE OUTPUT**
```json
{
  "step_id": "S1",
  "code_edits": [
    {
      "path": "src/services/dataset.py",
      "language": "python",
      "content": "import pandas as pd\n\ndef generate_dataset(n_rows: int, params, reference_data) -> pd.DataFrame:\n    return pd.DataFrame([])\n"
    }
  ],
  "checklist_predictions": ["dataset.generate_dataset exists"]
}
```