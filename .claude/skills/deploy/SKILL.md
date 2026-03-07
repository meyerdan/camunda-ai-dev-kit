---
name: deploy
description: Deploy all Camunda resources (BPMN, DMN, forms) to the engine. Use when ready to deploy process definitions.
---

Deploy all resources to Camunda. Use c8ctl (`c8 deploy`).

- Java with src/main/resources/: auto-deploys on startup. Just run the app.
- SaaS: use a c8ctl profile (see `env-saas.md`)

Deployment is atomic — all succeed or none deploy.
