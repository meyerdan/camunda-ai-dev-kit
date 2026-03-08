/**
 * Mock Chat Server for async-chatbot-agent example.
 *
 * Simulates an external chat system:
 * 1. Receives messages via POST /api/chat/send
 * 2. After a short delay, sends a reply back via webhook callback
 *
 * This demonstrates the async send+wait pattern where:
 * - The agent tool sends a message (service task)
 * - The process waits for a reply (webhook catch event)
 * - The external system calls back with the reply
 */

const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3002;
const WEBHOOK_BASE = process.env.WEBHOOK_BASE || 'http://localhost:8086';

// Knowledge base (sync tool endpoint)
const knowledge = {
  'bpmn': 'BPMN (Business Process Model and Notation) is a graphical notation for specifying business processes. Key elements include events (start, intermediate, end), activities (tasks, sub-processes), gateways (exclusive, parallel, inclusive), and sequence flows.',
  'dmn': 'DMN (Decision Model and Notation) is a standard for modeling business decisions. It uses decision tables with input/output columns, hit policies (UNIQUE, FIRST, COLLECT, etc.), and FEEL expressions.',
  'camunda': 'Camunda 8 is a process orchestration platform built on Zeebe, a distributed workflow engine. It supports BPMN, DMN, forms, connectors, and job workers.',
  'zeebe': 'Zeebe is the workflow engine in Camunda 8. It is a distributed, horizontally scalable engine that uses an event-sourced architecture with partitioned processing.',
};

// GET /api/knowledge?q=<query> — sync knowledge lookup
app.get('/api/knowledge', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  console.log(`[Knowledge] Query: "${query}"`);

  const results = Object.entries(knowledge)
    .filter(([key]) => query.includes(key))
    .map(([key, value]) => ({ topic: key, content: value }));

  if (results.length === 0) {
    res.json({ results: [], message: 'No matching knowledge found. Try asking the chat tool instead.' });
  } else {
    res.json({ results });
  }
});

// POST /api/chat/send — async message send (replies via webhook after delay)
app.post('/api/chat/send', (req, res) => {
  const { message, correlationKey, chatId } = req.body;
  console.log(`[Chat] Received message for chat ${chatId}: "${message}"`);
  console.log(`[Chat] Correlation key: ${correlationKey}`);

  // Acknowledge receipt immediately
  res.json({ status: 'sent', correlationKey });

  // Simulate async reply after 2 seconds (calls back via webhook)
  setTimeout(async () => {
    const reply = generateReply(message);
    console.log(`[Chat] Sending reply via webhook: "${reply.substring(0, 80)}..."`);

    try {
      const webhookUrl = `${WEBHOOK_BASE}/inbound/chat-reply`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correlationKey,
          chatId,
          text: reply,
        }),
      });
      console.log(`[Chat] Webhook response: ${response.status}`);
    } catch (err) {
      console.error(`[Chat] Webhook callback failed:`, err.message);
    }
  }, 2000);
});

function generateReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes('bpmn')) {
    return 'BPMN is great for modeling business processes! It provides a visual notation that both business analysts and developers can understand. The key elements are events, activities, gateways, and flows.';
  } else if (msg.includes('camunda') || msg.includes('zeebe')) {
    return 'Camunda 8 is a powerful process orchestration platform. It uses Zeebe as its distributed workflow engine and supports BPMN, DMN, forms, and over 40 built-in connectors.';
  } else if (msg.includes('hello') || msg.includes('hi')) {
    return 'Hello! I\'m the chat assistant. I can help you with questions about process automation, BPMN, and Camunda. What would you like to know?';
  } else {
    return `That's an interesting question about "${message.substring(0, 50)}". Process automation can help streamline workflows like this. Would you like me to explain how BPMN could model this scenario?`;
  }
}

app.listen(PORT, () => {
  console.log(`Mock Chat Server running on http://localhost:${PORT}`);
  console.log(`  Knowledge API: GET  http://localhost:${PORT}/api/knowledge?q=<query>`);
  console.log(`  Chat Send:     POST http://localhost:${PORT}/api/chat/send`);
  console.log(`  Webhook target: ${WEBHOOK_BASE}/inbound/chat-reply`);
});
