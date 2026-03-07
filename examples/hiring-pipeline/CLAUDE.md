# Hiring Pipeline

## Config
- Environment: C8 Run (local)
- Language: Node.js
- Key patterns: **call activities, subprocess decomposition, multiple user tasks**

## Process
Job application received → screen resume (DMN) → if qualified: schedule interviews (call activity) → hiring decision → send offer or rejection → done.

The interview stage is a **separate process** invoked via call activity, enabling reuse across different hiring workflows.

### Main Process: hiring-pipeline
Application → DMN screen → qualified? → call interview-process → hiring committee review → offer/reject → notify candidate

### Child Process: interview-process
Schedule interview → interviewer completes feedback form → score interview (DMN) → return results to parent

### Variables
| Name | Type | Set By | Description |
|------|------|--------|-------------|
| candidateName | string | start | Applicant's name |
| position | string | start | Job position |
| resumeScore | number | DMN | Resume screening score (0-100) |
| qualified | boolean | gateway | Whether candidate passes screening |
| interviewScore | number | child process | Interview score from child process |
| interviewFeedback | string | child process | Interviewer's feedback |
| hiringDecision | string | form | OFFER or REJECT |

### Call Activity Configuration
- Called element: `interview-process`
- Input mapping: candidateName, position
- Output mapping: interviewScore, interviewFeedback
- Propagate all variables: false (only map what's needed)

### Error Handling
- Error boundary on call activity: catches interview cancellation
- Non-interrupting timer on hiring committee review: reminder after 3 days

## Components
- `resources/hiring-pipeline.bpmn` — main process
- `resources/interview-process.bpmn` — child process (called via call activity)
- `resources/resume-screening.dmn` — resume screening rules
- `resources/interview-scoring.dmn` — interview scoring rules
- `resources/interviewer-feedback.form` — interview feedback form
- `resources/hiring-decision.form` — hiring committee form

## Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Full hire | resumeScore > 70, interviewScore > 60 | Offer sent |
| Screen out | resumeScore < 50 | Rejected at screening, no interview |
| Interview cancel | Interviewer cancels | Error boundary, reschedule or reject |
