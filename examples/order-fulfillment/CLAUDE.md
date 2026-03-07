# Order Fulfillment

## Config
- Environment: C8 Run (local)
- Language: Node.js
- Key patterns: **message correlation, event-based gateways, intermediate catch events**

## Process
Order placed → reserve inventory → send payment request → wait for payment (with timeout) → ship order → wait for delivery confirmation → complete.

### Variables
| Name | Type | Set By | Description |
|------|------|--------|-------------|
| orderId | string | start | Unique order identifier (used as correlation key) |
| customerId | string | start | Customer placing the order |
| items | list | start | Items in the order |
| totalAmount | number | start | Order total |
| paymentReceived | boolean | message | Set when payment message correlates |
| shipmentTrackingId | string | worker | Tracking ID from shipping service |
| deliveryConfirmed | boolean | message | Set when delivery message correlates |

### Message Correlation
| Message Name | Correlation Key | Source |
|-------------|----------------|--------|
| `payment-received` | `=orderId` | External payment system |
| `delivery-confirmed` | `=orderId` | Shipping provider webhook |

### Error Handling
- Event-based gateway after payment request: payment message OR 7-day timer
- Timer expires → cancel order, refund inventory
- Error boundary on ship-order task for shipping failures

## Components
- `resources/order-fulfillment.bpmn` — main process with message correlation
- Workers: reserve-inventory, ship-order, cancel-order

## Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Happy path | orderId=ORD-001, pay within timeout | Order shipped and delivered |
| Payment timeout | orderId=ORD-002, no payment in 7 days | Order cancelled |
| Shipping failure | orderId=ORD-003, ship-order throws error | Error boundary triggers |
