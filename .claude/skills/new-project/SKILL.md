---
name: new-project
description: Scaffold a new Camunda 8 project with the right structure, dependencies, and docs. Use when starting a new process automation project.
argument-hint: "[description, language, environment]"
---

Read `docs/camunda-dev-guide.md` first.

$ARGUMENTS

Detect env+lang from arguments (java/spring → Java, node/ts → Node.js, saas/cloud → SaaS, local/c8run → C8 Run). If unclear, ask.

1. Create: resources/, workers/ (or src/main/ for Java), docs/, tools/
2. Copy the relevant docs from `docs/` (dev guide + env module + lang module)
3. Generate CLAUDE.md with the project spec using `templates/CLAUDE.md` as a skeleton
4. Init the project (package.json or pom.xml)
5. Verify c8ctl is installed: `c8 --version` (if not: `npm install @camunda8/cli -g`)
