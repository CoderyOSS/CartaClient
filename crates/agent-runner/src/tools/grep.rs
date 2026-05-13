use crate::tools::{Tool, ToolContext};
use anyhow::Result;
use async_trait::async_trait;
use serde_json::{json, Value};

pub struct GrepTool;

#[async_trait]
impl Tool for GrepTool {
    fn name(&self) -> &str {
        "grep"
    }

    fn description(&self) -> &str {
        "Search file contents with a regex pattern, returns matching lines with context"
    }

    fn input_schema(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "pattern": {
                    "type": "string",
                    "description": "Regex pattern to search for"
                },
                "path": {
                    "type": "string",
                    "description": "Directory or file path relative to workspace (default: workspace root)"
                },
                "include": {
                    "type": "string",
                    "description": "File pattern to include (e.g. '*.rs')"
                }
            },
            "required": ["pattern"]
        })
    }

    async fn execute(&self, args: &Value, ctx: &ToolContext) -> Result<String> {
        let pattern = args["pattern"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("missing 'pattern' argument"))?;
        let search_path = args["path"]
            .as_str()
            .unwrap_or(".");
        let include = args["include"].as_str();

        let re = regex::Regex::new(pattern)?;

        let base = ctx.workspace.join(search_path);
        let mut results = Vec::new();

        if base.is_file() {
            search_file(&base, &re, &mut results, &ctx.workspace)?;
        } else if base.is_dir() {
            search_dir(&base, &re, &mut results, &ctx.workspace, include)?;
        }

        if results.is_empty() {
            Ok("no matches found".to_string())
        } else {
            Ok(results.join("\n"))
        }
    }
}

fn search_file(
    path: &std::path::Path,
    re: &regex::Regex,
    results: &mut Vec<String>,
    workspace: &std::path::Path,
) -> Result<()> {
    let content = std::fs::read_to_string(path)?;
    let relative = path.strip_prefix(workspace).unwrap_or(path);
    for (i, line) in content.lines().enumerate() {
        if re.is_match(line) {
            results.push(format!("{}:{}: {}", relative.display(), i + 1, line));
        }
    }
    Ok(())
}

fn search_dir(
    dir: &std::path::Path,
    re: &regex::Regex,
    results: &mut Vec<String>,
    workspace: &std::path::Path,
    include: Option<&str>,
) -> Result<()> {
    let pattern = if let Some(inc) = include {
        format!(
            "{}/**/*.{}",
            dir.to_string_lossy(),
            inc.trim_start_matches("*.").trim_start_matches('.')
        )
    } else {
        format!("{}/**/*", dir.to_string_lossy())
    };

    for entry in glob::glob(&pattern)? {
        if let Ok(path) = entry {
            if path.is_file() {
                if let Err(_) = search_file(&path, re, results, workspace) {
                    continue;
                }
            }
        }
    }

    Ok(())
}
