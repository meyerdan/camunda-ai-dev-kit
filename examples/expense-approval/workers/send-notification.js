import { Camunda8 } from '@camunda8/sdk';

const c8 = new Camunda8();
const zeebe = c8.getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: 'send-notification',
  taskHandler: async (job) => {
    const { employeeName, department, amount, managerDecision, managerComments } = job.variables;

    console.log('--- Notification ---');
    console.log(`Employee: ${employeeName}`);
    console.log(`Department: ${department}`);
    console.log(`Amount: ${amount}`);
    console.log(`Decision: ${managerDecision}`);
    if (managerComments) {
      console.log(`Comments: ${managerComments}`);
    }
    console.log('--- End Notification ---');

    return job.complete({ notificationSent: true });
  }
});

console.log('send-notification worker started');
