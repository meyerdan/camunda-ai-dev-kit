import express from 'express';
import { readFileSync, existsSync } from 'fs';
import { resolve, join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = process.argv[2];
if (!file) {
  console.error('Usage: node serve.js <file.bpmn|file.dmn|file.form>');
  process.exit(1);
}

const filePath = resolve(file);
if (!existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const ext = extname(filePath).toLowerCase();
const typeMap = { '.bpmn': 'bpmn', '.dmn': 'dmn', '.form': 'form' };
const fileType = typeMap[ext];
if (!fileType) {
  console.error(`Unsupported file type: ${ext} (expected .bpmn, .dmn, or .form)`);
  process.exit(1);
}

const app = express();
const PORT = 3333;

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/file', (req, res) => {
  const content = readFileSync(filePath, 'utf-8');
  const contentType = fileType === 'form' ? 'application/json' : 'application/xml';
  res.type(contentType).send(content);
});

app.get('/type', (req, res) => {
  res.json({ type: fileType, name: file });
});

app.listen(PORT, () => {
  console.log(`Camunda Viewer: http://localhost:${PORT}`);
  console.log(`Viewing ${fileType.toUpperCase()}: ${filePath}`);
});
