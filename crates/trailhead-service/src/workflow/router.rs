use anyhow::{anyhow, Context as AnyhowContext, Result};
use cel::{Context, Program};
use serde_json::Value;

use super::parser::Route;

pub fn evaluate_routes(routes: &[Route], response: &Value) -> Result<Option<String>> {
    for route in routes {
        if evaluate_condition(&route.when, response)? {
            return Ok(Some(route.next.clone()));
        }
    }
    Ok(None)
}

fn evaluate_condition(condition: &str, response: &Value) -> Result<bool> {
    let program = Program::compile(condition)
        .with_context(|| format!("compile CEL: {}", condition))?;
    let mut ctx = Context::default();
    ctx.add_variable("response", response.clone())
        .map_err(|e| anyhow!("CEL context: {}", e))?;
    let result = program
        .execute(&ctx)
        .with_context(|| format!("eval CEL: {}", condition))?;
    match result {
        cel::Value::Bool(b) => Ok(b),
        other => Err(anyhow!("CEL did not return bool: {} (got {:?})", condition, other)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn route(when: &str, next: &str) -> Route {
        Route {
            when: when.into(),
            next: next.into(),
        }
    }

    #[test]
    fn string_equality() {
        let routes = vec![
            route(r#"response.complexity == "simple""#, "edit"),
            route("true", "pause"),
        ];
        assert_eq!(
            evaluate_routes(&routes, &json!({"complexity": "simple"})).unwrap(),
            Some("edit".into())
        );
    }

    #[test]
    fn boolean_field() {
        let routes = vec![
            route("response.passed", "review"),
            route("true", "fix"),
        ];
        assert_eq!(
            evaluate_routes(&routes, &json!({"passed": false})).unwrap(),
            Some("fix".into())
        );
    }

    #[test]
    fn numeric_comparison() {
        let routes = vec![
            route("response.count > 3", "pause"),
            route("true", "fix"),
        ];
        assert_eq!(
            evaluate_routes(&routes, &json!({"count": 5})).unwrap(),
            Some("pause".into())
        );
    }

    #[test]
    fn compound_expression() {
        let routes = vec![
            route("response.success && response.files > 0", "test"),
            route("true", "edit"),
        ];
        assert_eq!(
            evaluate_routes(&routes, &json!({"success": true, "files": 3})).unwrap(),
            Some("test".into())
        );
    }

    #[test]
    fn no_match() {
        let routes = vec![route(r#"response.x == "no""#, "edit")];
        assert_eq!(
            evaluate_routes(&routes, &json!({"x": "yes"})).unwrap(),
            None
        );
    }
}
