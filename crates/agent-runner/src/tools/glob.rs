use crate::tools::{Tool, ToolContext};
use anyhow::Result;
use async_trait::async_trait;
use serde_json::{json, Value};

pub struct GlobTool;

#[async_trait]
impl Tool for GlobTool {
    fn name(&self) -> &str {
        "glob"
    }

    fn description(&self) -> &str {
        "Find files matching a glob pattern in the workspace"
    }

    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "pattern": {
                    "type": "string",
                    "description": "Glob pattern to match (e.g. '**/*.rs')"
                }
            },
            "required": ["pattern"]
        })
    }

    async fn execute(&self, args: &Value, ctx: &ToolContext) -> Result<String> {
        let pattern = args["pattern"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("missing 'pattern' argument"))?;

        let paths = glob::glob(&ctx.workspace.join(pattern).to_string_lossy())?;

        let mut results = Vec::new();
        for entry in paths {
            if let Ok(path) = entry {
                let relative = path
                    .strip_prefix(&ctx.workspace)
                    .unwrap_or(&path);
                results.push(relative.to_string_lossy().to_string());
            }
        }

        if results.is_empty() {
            Ok("no files found".to_string())
        } else {
            Ok(results.join("\n"))
        }
    }
}
