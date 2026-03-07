# Expense Approval Process

## Config
- Environment: C8 Run (local) → see docs/env-c8run.md
- Language: Node.js → see docs/lang-nodejs.md
- Dev patterns: see docs/camunda-dev-guide.md

## Process
Employee submits expense → manager reviews (approve/reject) → if approved and amount > 1000 then finance approval needed → send notification → done.

Uses REST connectors for a mock notification API. Includes error boundary events and a reminder timer on the manager review.

### Variables
| Name | Type | Set By | Description |
|------|------|--------|-------------|
| employeeName | string | start | Employee who submitted the expense |
| department | string | start | Employee's department |
| amount | number | start | Expense amount |
| description | string | start | Expense description |
| approvalLevel | string | DMN | AUTO, MANAGER, or FINANCE |
| managerDecision | string | form | Approve or Reject |
| managerComments | string | form | Manager's comments |
| financeDecision | string | form | Finance approve/reject (if amount > 1000) |

### Error Handling
- Error boundary event on notification task (catch connector failures)
- Non-interrupting timer boundary on manager review (reminder after PT24H)

## Components
- `resources/expense-approval.bpmn` — main process
- `resources/approval-routing.dmn` — routing decision table
- `resources/manager-review.form` — manager review form
- `workers/send-notification.js` — notification worker (logs details)

## Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Auto-approve | amount=200, department=Engineering | Skips manager, sends notification |
| Manager approve | amount=800, department=Sales | Manager reviews, approves, notification sent |
| Manager reject | amount=800, department=Sales | Manager rejects, notification sent |
| Finance required | amount=1500, department=Marketing | Manager approves → finance reviews → notification |

## Build Order
1. DMN decision table (approval-routing)
2. BPMN process (expense-approval)
3. Camunda Form (manager-review)
4. Worker (send-notification)
5. Deploy all, start test instance
