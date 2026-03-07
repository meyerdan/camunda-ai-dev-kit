# Camunda SaaS

Auth: OAuth2 client credentials.
- Audience: `<clusterId>.zeebe.camunda.io`
- Token URL: `https://login.cloud.camunda.io/oauth/token`

Worker env vars:
```
CAMUNDA_CLIENT_ID=<your-client-id>
CAMUNDA_CLIENT_SECRET=<your-client-secret>
CAMUNDA_CLUSTER_ID=<your-cluster-id>
CAMUNDA_CLUSTER_REGION=bru-2
```

Java (`application.yaml`):
```yaml
camunda:
  client:
    mode: saas
    auth:
      client-id: ${CAMUNDA_CLIENT_ID}
      client-secret: ${CAMUNDA_CLIENT_SECRET}
    cluster-id: ${CAMUNDA_CLUSTER_ID}
    region: ${CAMUNDA_CLUSTER_REGION}
```

REST connectors CANNOT reach localhost — the engine runs in the cloud.
Use publicly reachable URLs or ngrok.

Cluster MCP: not available on SaaS — use c8ctl for all operations.

Git Sync: connect your repo to Web Modeler to view generated BPMN/DMN/Forms visually.
