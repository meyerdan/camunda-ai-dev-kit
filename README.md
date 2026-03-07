# Camunda AI Dev Kit

A Claude Code plugin that gives AI coding agents everything they need to build Camunda 8 process automation projects — without bloating their context with things they already know.

## Install as Plugin

```bash
claude plugin add camunda/camunda-ai-dev-kit
```

This auto-configures the Camunda Docs MCP and adds all skills.

## Manual Setup (without plugin)

1. Clone this repo into your project
2. Install the CLI: `npm install @camunda8/cli -g`
3. Add the Camunda Docs MCP:
   ```bash
   claude mcp add camunda-docs --transport http https://camunda-docs.mcp.kapa.ai
   ```

## Skills

```
/new-project  — scaffold a new Camunda project
/new-process  — generate a BPMN process
/new-dmn      — generate a DMN decision table
/new-form     — generate a Camunda Form
/new-worker   — generate a job worker
/deploy       — deploy resources to Camunda
/start        — start a process instance
/status       — check instance/incident status
/view-process       — visualize BPMN, DMN, or Form files
/setup-environment  — install and start Camunda 8 Run locally
```

## What's in the Kit

```
.claude-plugin/plugin.json  — plugin manifest
.mcp.json                   — auto-configures Camunda Docs MCP
.claude/skills/             — 11 skills (slash commands)
docs/
  camunda-dev-guide.md      — core Camunda 8 patterns (BPMN, connectors, DMN, forms, CLI)
  env-c8run.md              — C8 Run (local) config
  env-saas.md               — Camunda SaaS config
  lang-nodejs.md            — Node.js worker SDK
  lang-java.md              — Java/Spring Boot worker SDK
templates/CLAUDE.md         — project CLAUDE.md template
tools/camunda-viewer/       — local file viewer (BPMN, DMN, Forms)
examples/                   — 4 working examples (expense-approval, order-fulfillment, batch-processor, hiring-pipeline)
```

## Design Principles

- **Dev guide is sacred** — only Camunda-specific knowledge an AI can't infer
- **Skills say WHAT, not HOW** — Claude figures out the implementation
- **c8ctl is the primary CLI** — `c8 deploy`, `c8 run`, `c8 watch`
- **~500 lines total** — minimal context, maximum capability

## Links

- [Camunda 8 Docs](https://docs.camunda.io)
- [c8ctl CLI](https://www.npmjs.com/package/@camunda8/cli)
- [Camunda Docs MCP](https://docs.camunda.io/docs/reference/mcp-docs/)
- [@camunda8/sdk (Node.js)](https://www.npmjs.com/package/@camunda8/sdk)
- [Camunda Spring Boot Starter](https://docs.camunda.io/docs/apis-tools/spring-zeebe-sdk/getting-started/)
