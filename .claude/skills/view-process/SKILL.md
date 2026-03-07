---
name: view-process
description: Launch a bpmn-js viewer to visually inspect a BPMN diagram in the browser.
argument-hint: "[bpmn file]"
---

Launch a bpmn-js viewer to inspect the BPMN diagram visually.

$ARGUMENTS

If tools/bpmn-viewer/ doesn't exist, create it: an Express server + index.html using bpmn-js (from unpkg CDN) that loads a BPMN file and renders it with fit-viewport zoom and a reload button.

Requires express: `npm install express` (if not already installed).

Start it with: node tools/bpmn-viewer/serve.js resources/<file>.bpmn
