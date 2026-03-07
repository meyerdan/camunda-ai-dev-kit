# BPMN Modeling Best Practices

Rules for generating well-structured, readable BPMN process models. Follow these when creating or modifying any `.bpmn` file.

Source: https://docs.camunda.io/docs/components/best-practices/best-practices-overview/

---

## Naming Conventions

### Activities (tasks, subprocesses)
- Tasks: **object + verb infinitive** → "Review tweet", "Send invoice", "Check credit-worthiness"
- Subprocesses/call activities: **object + nominalized verb** → "Order fulfillment", "Payment processing"
- AVOID vague verbs: "Handle invoice", "Process order" — be specific about WHAT you do

### Events
- **Object + state verb** → "Invoice paid", "Order received", "Tweet published"
- Be specific about the business state: "Invoice paid" is better than "Invoice processed" (because "Invoice processed" could also mean rejected)
- End events should distinguish success from failure: "Invoice paid" vs "Invoice rejected"

### Gateways
- Exclusive/inclusive gateways: **pose a question** → "Tweet approved?", "Order complete?"
- Outgoing sequence flows: **answer the question** → "Yes", "No", "> $1000", "Credit-worthy"
- Do NOT name parallel gateways, joining gateways, or event-based gateways

### IDs (technically relevant)
Use meaningful, prefixed IDs — they show up in logs and debugging:

| Element | Prefix | Example |
|---------|--------|---------|
| Process | (none) | `TweetApprovalProcess` |
| Start event | `StartEvent_` | `StartEvent_NewTweetWritten` |
| User task | `Task_` | `Task_ReviewTweet` |
| Service task | `Task_` | `Task_SendInvoice` |
| Gateway | `Gateway_` | `Gateway_TweetApproved` |
| Sequence flow | `Flow_` | `Flow_TweetApprovedNo` |
| Boundary event | `BoundaryEvent_` | `BoundaryEvent_TweetDuplicated` |
| End event | `EndEvent_` | `EndEvent_TweetPublished` |
| Error | `Error_` | `Error_TweetDuplicated` |
| Message | `Message_` | `Message_NewTweetWritten` |

Align the BPMN filename with the process ID: `tweet-approval.bpmn` → `TweetApprovalProcess`

---

## Process Structure

### Happy path first
1. Define the desired **end result** (success end event)
2. Define the **trigger** (start event)
3. Collect **activities** that ALWAYS need to happen
4. Add milestones and external dependencies
5. THEN layer in exceptions one at a time

### Structure rules
- Place happy path activities in a **straight sequence** — exceptions branch off
- For very long processes, use **link events** instead of long backwards-flowing connections
- Model **symmetrically**: pair splitting gateways with matching joining gateways to form visual blocks

### Always be explicit
- Always show **start and end events** (don't rely on implicit start/end)
- Always use **gateway symbols** for splits — don't use conditional flows directly on tasks
- Use **separate gateway symbols** for splitting and joining — don't combine split+join in one gateway
- Model **symmetrically**: pair splitting gateways with matching joining gateways to form visual blocks

### Avoid
- **Lanes** — they conflict with symmetric modeling and make maintenance harder. Use collaboration diagrams (separate pools) instead, or add role in task name: "Review tweet [Manager]"
- **Retry loops in the model** — use Camunda's built-in retry mechanism (retries attribute on task definition). Modeling retries bloats the diagram and is an anti-pattern

---

## Error Handling Patterns

### Choose the right pattern for the situation

| Problem type | When it occurs | Pattern |
|-------------|---------------|---------|
| Undesired but expected result | At a specific point after an activity | **XOR gateway** after the task |
| Fatal problem preventing any result | During an activity | **Boundary error event** (interrupting) |
| Additional work needed | During an activity | **Boundary event** (non-interrupting) |
| Can happen anywhere in the process | Anytime | **Event subprocess** |
| Timeout / no response | While waiting | **Boundary timer** or **event-based gateway + timer** |

### Gateway vs boundary error event — the decision rule
- If the task CAN produce the result but it's undesired → **gateway** (e.g., "Credit-worthy?" → No)
- If the task CANNOT produce any result due to a problem → **boundary error event** (e.g., customer ID not found)

### Business vs technical errors
- **Business reactions** (different process path): model in the BPMN with error events, gateways
- **Technical reactions** (retry, incident): handle via Camunda's retry mechanism — do NOT model in BPMN
- Even technical problems can warrant business reactions (e.g., scoring service down → give default good rating)

### Multi-step escalation (wait → remind → give up)
Preferred pattern: use **non-interrupting boundary timer** on a receive task:
```
[Receive task: "Wait for delivery"] 
  ├── (non-interrupting timer: 2 weeks) → [Remind dealer]
  └── (interrupting timer: 3 weeks) → [Cancel order]
```
This keeps the process in "ready to receive" state throughout, avoiding lost messages.

### Event subprocesses for "can happen anytime"
- **Non-interrupting**: customer requests status update → provide info, continue process
- **Interrupting**: customer requests cancellation → terminate the process

### Cancellation pattern (nested event subprocesses)
To cancel a process from within an event subprocess:
1. Non-interrupting event subprocess catches the cancel request, reviews it
2. If accepted: throw an error event to end the event subprocess
3. An interrupting event subprocess catches that error and terminates the main process

---

## Flexibility Patterns

### Boundary events on subprocesses
Wrap a section of the process in a subprocess to define a "scope" where flexible reactions apply:
- Non-interrupting boundary events → do additional work while subprocess continues
- Interrupting boundary events → cancel the subprocess and take alternative path

### Terminate end events in subprocesses
A terminate end event inside a subprocess only terminates THAT subprocess (not the whole process). Use this to cancel parallel paths within a subprocess while completing it successfully.

### Escalation events
Use escalation events to signal between a subprocess and its parent scope without terminating:
- Thrown from inside a subprocess
- Caught by non-interrupting boundary event on the parent → triggers additional work in parallel

---

## DMN Best Practices

### Choosing hit policies
- **FIRST** (F): Rules are ordered by priority, first match wins. Use for rule tables with clear priority ordering (most common for business rules)
- **UNIQUE** (U): Only one rule can match. Use when inputs guarantee exactly one match. Throws error on multiple matches
- **ANY** (A): Multiple rules can match but must produce the same output. Use for validation/consistency
- **COLLECT** (C): All matching rules produce output, collected into a list. Can aggregate with SUM, MIN, MAX, COUNT
- **RULE ORDER** (R): All matching rules produce output, ordered by rule position

Default recommendation: **FIRST** for most decision tables — it's the most forgiving and maps naturally to business logic ("check these conditions in order, first match wins").
