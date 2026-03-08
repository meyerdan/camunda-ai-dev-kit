# Async Chatbot Agent

## Config
- Environment: C8 Run (local), requires 8.8+ for AI Agent connector
- Language: Node.js
- Key patterns: **agentic orchestration, ad-hoc sub-process, sub-flow tool, webhook connector, correlation keys**

## Process
User submits a question → AI Agent decides how to handle it → tools include a **send-and-wait** chat tool (sub-process with webhook) → agent responds.

This example demonstrates the **async sub-flow tool pattern**: an agent tool that sends a message to an external system and waits for an async reply via webhook callback.

The AI Agent uses an ad-hoc sub-process (AI Agent Sub-process pattern) with these tools:
- **Send chat message** — **sub-process** containing: service task (send message via REST) → intermediate catch event (webhook waits for reply). This is one tool from the agent's perspective but two BPMN steps.
- **Look up knowledge base** — REST connector: GET http://localhost:3002/api/knowledge?q=:query (synchronous tool for comparison)

### Key Concepts
- **Sub-flow tool**: A sub-process inside the ad-hoc sub-process acts as a single tool but contains multiple steps
- **Webhook correlation**: Each message gets a unique correlation key so replies route to the correct waiting instance
- **toolCallResult propagation**: The webhook's `resultExpression` writes to `toolCallResult` so the agent receives the reply

### Variables
| Name | Type | Set By | Description |
|------|------|--------|-------------|
| topic | string | start | The topic or question to discuss |
| chatId | string | start | Unique chat session identifier |
| agent | object | AI Agent | Agent state (context, response, toolCalls) |
| replyCorrelationKey | string | send worker | Unique per-message correlation key |
| toolCallResult | any | tool tasks | Current tool's output |

### Secrets Configuration
Set the LLM API key before deploying:
```bash
# C8 Run: set env var before starting C8 Run
export OPENAI_API_KEY=<your-key>
```

## Components
- `resources/async-chatbot.bpmn` — agentic process with sub-flow tool
- `workers/chat-server.js` — mock chat server with webhook callback (Express on port 3002)
- `package.json` — dependencies

## Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Chat message | topic="What is BPMN?", chatId="test-1" | Agent sends message, webhook receives reply, agent responds |
| Knowledge lookup | topic="List all BPMN event types", chatId="test-2" | Agent uses sync knowledge tool, responds directly |

## Build Order
1. Start mock chat server: `npm install && node workers/chat-server.js`
2. Deploy: `c8 deploy ./resources`
3. Set `OPENAI_API_KEY` env var, restart C8 Run if needed
4. Test: `c8 create pi --id=async-chatbot --variables='{"topic":"What is BPMN?","chatId":"test-1"}'`
5. The mock server auto-replies via webhook after 2 seconds
