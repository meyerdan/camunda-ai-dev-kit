---
name: new-project
description: Scaffold a new Camunda 8 project with the right structure, dependencies, and docs. Use when starting a new process automation project.
argument-hint: "[description, language, environment]"
---

Read the Camunda dev guide from the plugin root first (find it with `find . -name camunda-dev-guide.md`).

$ARGUMENTS

Detect env+lang from arguments (java/spring → Java, node/ts → Node.js, saas/cloud → SaaS, local/c8run → C8 Run). If unclear, ask.

1. Create: resources/, workers/ (or src/main/ for Java)
2. Generate CLAUDE.md with the project spec
3. Init the project (package.json with `"type": "module"` or pom.xml)
4. For Node.js: `npm install @camunda8/sdk@^8.8.0 express`
5. Verify c8ctl is installed: `c8 --version` (if not: `npm install @camunda8/cli -g`)
