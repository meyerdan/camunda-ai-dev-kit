# Batch Processor

## Config
- Environment: C8 Run (local)
- Language: Node.js
- Key patterns: **multi-instance subprocess, parallel execution, collection-based iteration**

## Process
Receive batch of items → validate batch → process each item in parallel (multi-instance) → aggregate results → send summary report → done.

### Variables
| Name | Type | Set By | Description |
|------|------|--------|-------------|
| batchId | string | start | Unique batch identifier |
| items | list | start | Array of items to process (e.g., `[{"id":"A","data":"..."},...]`) |
| item | object | multi-instance | Current item (loop variable) |
| itemResult | object | worker | Processing result for current item |
| results | list | output mapping | Collected results from all instances |
| successCount | number | worker | Count of successful items |
| failureCount | number | worker | Count of failed items |

### Multi-Instance Configuration
The subprocess uses `items` as the input collection, `item` as the loop variable, and collects `itemResult` into `results`.

### Error Handling
- Individual item failures don't stop the batch — error boundary on the item processing task catches failures and marks the item as failed
- Batch-level timeout: non-interrupting timer after 1 hour sends progress notification

## Components
- `resources/batch-processor.bpmn` — main process with multi-instance subprocess
- Workers: validate-batch, process-item, aggregate-results, send-report

## Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| All succeed | 5 valid items | All processed, summary sent |
| Partial failure | 5 items, 2 invalid | 3 succeed, 2 marked failed, summary sent |
| Empty batch | 0 items | Validation rejects, process ends early |
