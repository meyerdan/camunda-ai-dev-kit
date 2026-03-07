import express from 'express';
import { readFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const bpmnFile = process.argv[2];
if (!bpmnFile) {
  console.error('Usage: node serve.js <path-to-bpmn-file>');
  process.exit(1);
}

const bpmnPath = resolve(bpmnFile);
if (!existsSync(bpmnPath)) {
  console.error(`File not found: ${bpmnPath}`);
  process.exit(1);
}

const app = express();
const PORT = 3333;

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/bpmn', (req, res) => {
  res.type('application/xml').send(readFileSync(bpmnPath, 'utf-8'));
});

app.listen(PORT, () => {
  console.log(`BPMN Viewer: http://localhost:${PORT}`);
  console.log(`Viewing: ${bpmnPath}`);
});
