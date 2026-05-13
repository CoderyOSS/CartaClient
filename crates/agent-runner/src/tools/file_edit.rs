use crate::tools::{Tool, ToolContext};
use anyhow::{anyhow, Result};
use async_trait::async_trait;
use serde_json::{json, Value};
use similar::TextDiff;

pub struct FileEditTool;

#[async_trait]
impl Tool for FileEditTool {
    fn name(&self) -> &str {
        "edit"
    }

    fn description(&self) -> &str {
        "Replace a unique string in a file with a new string"
    }

    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "File path relative to workspace"
                },
                "old_string": {
                    "type": "string",
                    "description": "The text to find (must be unique in the file)"
                },
                "new_string": {
                    "type": "string",
                    "description": "The replacement text"
                }
            },
            "required": ["path", "old_string", "new_string"]
        })
    }

    async fn execute(&self, args: &Value, ctx: &ToolContext) -> Result<String> {
        let path_str = args["path"]
            .as_str()
            .ok_or_else(|| anyhow!("missing 'path' argument"))?;
        let old_string = args["old_string"]
            .as_str()
            .ok_or_else(|| anyhow!("missing 'old_string' argument"))?;
        let new_string = args["new_string"]
            .as_str()
            .ok_or_else(|| anyhow!("missing 'new_string' argument"))?;

        let file_path = ctx.workspace.join(path_str);
        let content = tokio::fs::read_to_string(&file_path).await?;

        let count = content.matches(old_string).count();
        if count == 0 {
            return Err(anyhow!("old_string not found in file"));
        }
        if count > 1 {
            return Err(anyhow!(
                "old_string found {} times, must be unique",
                count
            ));
        }

        let new_content = content.replacen(old_string, new_string, 1);
        tokio::fs::write(&file_path, &new_content).await?;

        let diff = TextDiff::from_lines(&content, &new_content);
        let mut diff_output = String::new();
        for change in diff.iter_all_changes() {
            let sign = match change.tag() {
                similar::ChangeTag::Delete => "-",
                similar::ChangeTag::Insert => "+",
                similar::ChangeTag::Equal => " ",
            };
            diff_output.push_str(&format!("{sign}{change}"));
        }

        Ok(diff_output)
    }
}
