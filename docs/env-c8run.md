# C8 Run (Local)

| Component | URL |
|-----------|-----|
| REST API | http://localhost:8080/v2/ |
| MCP Server | http://localhost:8080/mcp/cluster (built-in, enabled by default) |
| Operate | http://localhost:8080/operate |
| Tasklist | http://localhost:8080/tasklist |
| Zeebe gRPC | localhost:26500 |

No authentication.

MCP setup (Claude Code):
```
claude mcp add camunda --transport http http://localhost:8080/mcp/cluster
claude mcp add camunda-docs --transport http https://camunda-docs.mcp.kapa.ai
```

Worker env vars:
```
ZEEBE_REST_ADDRESS=http://localhost:8080
ZEEBE_GRPC_ADDRESS=grpc://localhost:26500
CAMUNDA_AUTH_STRATEGY=NONE
```

Java (`application.yaml`):
```yaml
camunda:
  client:
    mode: simple
    zeebe:
      enabled: true
      gateway-url: http://localhost:26500
      base-url: http://localhost:8080
```

REST connectors can reach `http://localhost:*` directly.

### Connector Secrets

C8 Run's connector runtime exposes **all environment variables** as connector secrets by default (no prefix needed). `{{secrets.OPENAI_API_KEY}}` resolves to the env var `OPENAI_API_KEY`.

**Important:** The env var must be in the connector runtime's process environment. If you restart C8 Run, ensure the shell has the var loaded (e.g., `source ~/.zprofile` first, or add to `~/.zshrc`). Vars set only in a Node.js `.env` file or in `connectors-application.properties` as Spring properties are **not** visible as connector secrets — only OS environment variables work.

The `CAMUNDA_CONNECTOR_SECRET_` prefix does **not** work by default. All env vars are exposed as secrets without any prefix.

### Known Issues

| Version | Issue | Workaround |
|---------|-------|------------|
| 8.9.0-alpha4 | Webhook connector version conflicts: redeploying BPMN with webhooks creates a new version but the old connector instance stays active and intercepts requests | Restart C8 Run after every deploy. Fixed in alpha5 (PR #6056). |
| 8.9.0-alpha1 | "Text cannot be null or empty" on AI Agent connector when LLM returns tool calls without text content | Upgrade to alpha2+ which includes fix (PR #4828). |
