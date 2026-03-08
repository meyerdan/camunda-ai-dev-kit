import express from 'express';

const app = express();
app.use(express.json());

const customers = {
  'CUST-001': { id: 'CUST-001', name: 'Alice Johnson', email: 'alice@example.com', tier: 'Gold', since: '2022-03-15' },
  'CUST-002': { id: 'CUST-002', name: 'Bob Smith', email: 'bob@example.com', tier: 'Silver', since: '2023-07-20' },
  'CUST-003': { id: 'CUST-003', name: 'Carol Davis', email: 'carol@example.com', tier: 'Bronze', since: '2024-01-10' },
};

const orders = [
  { orderId: 'ORD-1001', customerId: 'CUST-001', item: 'Laptop Stand', status: 'Shipped', trackingNumber: 'TRK-98765', estimatedDelivery: '2026-03-10' },
  { orderId: 'ORD-1002', customerId: 'CUST-001', item: 'USB-C Hub', status: 'Delivered', deliveredDate: '2026-02-28' },
  { orderId: 'ORD-1003', customerId: 'CUST-002', item: 'Monitor Arm', status: 'Processing', estimatedShip: '2026-03-12' },
  { orderId: 'ORD-1004', customerId: 'CUST-003', item: 'Keyboard', status: 'Delivered', deliveredDate: '2026-03-01' },
];

app.get('/api/customers/:id', (req, res) => {
  const customer = customers[req.params.id];
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

app.get('/api/orders', (req, res) => {
  const { customerId } = req.query;
  if (!customerId) return res.status(400).json({ error: 'customerId query parameter required' });
  const customerOrders = orders.filter(o => o.customerId === customerId);
  res.json(customerOrders);
});

app.post('/api/responses', (req, res) => {
  const { customerId, message } = req.body;
  console.log(`[Response] To: ${customerId} — ${message}`);
  res.json({ sent: true, customerId, message });
});

app.listen(3001, () => console.log('Customer API mock running on http://localhost:3001'));
