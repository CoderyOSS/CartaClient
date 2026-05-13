use crate::tools::{Tool, ToolContext};
use anyhow::Result;
use async_trait::async_trait;
use serde_json::{json, Value};


pub struct FileReadTool;

#[async_trait]
impl Tool for FileReadTool {
    fn name(&self) -> &str {
        "read"
    }

    fn description(&self) -> &str {
        "Read file contents with optional line offset and limit, returns line-numbered output"
    }

    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "File path relative to workspace"
                },
                "offset": {
                    "type": "integer",
                    "description": "Line number to start from (1-indexed)"
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of lines to read"
                }
            },
            "required": ["path"]
        })
    }

    async fn execute(&self, args: &Value, ctx: &ToolContext) -> Result<String> {
        let path_str = args["path"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("missing 'path' argument"))?;

        let file_path = ctx.workspace.join(path_str);

        let content = tokio::fs::read_to_string(&file_path).await?;

        let offset = args["offset"].as_u64().unwrap_or(0) as usize;
        let limit = args["limit"].as_u64();

        let lines: Vec<&str> = content.lines().collect();
        let start = if offset > 0 { offset - 1 } else { 0 };

        let result = if let Some(limit) = limit {
            let limit = limit as usize;
            lines[start..std::cmp::min(start + limit, lines.len())]
                .iter()
                .enumerate()
                .map(|(i, line)| format!("{}: {}", start + i + 1, line))
                .collect::<Vec<_>>()
                .join("\n")
        } else {
            lines[start..]
                .iter()
                .enumerate()
                .map(|(i, line)| format!("{}: {}", start + i + 1, line))
                .collect::<Vec<_>>()
                .join("\n")
        };

        Ok(result)
    }
}
