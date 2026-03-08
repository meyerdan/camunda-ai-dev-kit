# Customer Support Agent

## Config
- Environment: C8 Run (local), requires 8.8+ for AI Agent connector
- Language: Node.js
- Dev patterns, env config, and SDK docs are provided by the camunda-ai-dev-kit plugin
- Key patterns: **agentic orchestration, ad-hoc sub-process, AI Agent connector, fromAi(), human-in-the-loop**

## Process
Support ticket received → AI Agent analyzes and resolves using available tools → gateway: auto-resolved vs needs-follow-up → end.

The AI Agent uses an ad-hoc sub-process (AI Agent Sub-process pattern) with these tools:
- **Look up customer** — REST connector: GET http://localhost:3001/api/customers/:id
- **Check order status** — REST connector: GET http://localhost:3001/api/orders?customerId=:id
- **Send response** — REST connector: POST http://localhost:3001/api/responses
- **Escalate to human** — user task: routes complex/sensitive issues to a human agent

### Variables
| Name | Type | Set By | Description |
|------|------|--------|-------------|
| customerId | string | start | Customer submitting the ticket |
| issue | string | start | Description of the support issue |
| priority | string | start | LOW, MEDIUM, HIGH |
| agent | object | AI Agent | Agent state (context, response, toolCalls) |
| toolCallResult | any | tool tasks | Current tool's output (collected by engine into toolCallResults) |
| humanResponse | string | form | Response from the human agent (escalation) |

### Error Handling
- Error boundary on ad-hoc sub-process catches agent failures (connector timeout, LLM errors)

### Secrets Configuration
Set the LLM API key before deploying (BPMN defaults to OpenAI — adjust provider inputs for other LLMs):
```bash
# C8 Run: set env var before starting C8 Run
export OPENAI_API_KEY=<your-key>
```
SaaS: Console → Manage Clusters → Connector Secrets → add `OPENAI_API_KEY`

## Components
- `resources/customer-support.bpmn` — main agentic process
- `resources/escalation-form.form` — human escalation form
- `workers/customer-api.js` — mock customer/order API (Express on port 3001)
- `package.json` — dependencies

## Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Simple inquiry | customerId=CUST-001, issue="Where is my order?", priority=LOW | Agent looks up customer + order, responds automatically |
| Complex issue | customerId=CUST-002, issue="Billing discrepancy on last 3 invoices", priority=HIGH | Agent escalates to human via user task |
| Unknown customer | customerId=CUST-999, issue="Need help", priority=MEDIUM | Agent handles gracefully (customer not found) |

## Build Order
1. Mock API worker (`npm install && node workers/customer-api.js`) — start first so REST tools have an endpoint
2. BPMN process (customer-support.bpmn) — with ad-hoc sub-process and tools
3. Camunda Form (escalation-form.form) — for human escalation task
4. Deploy all resources: `c8 deploy ./resources`
5. Set LLM API key secret (see Secrets Configuration above)
6. Start test instance: `c8 create pi --id=customer-support --variables='{"customerId":"CUST-001","issue":"Where is my order?","priority":"LOW"}'`
