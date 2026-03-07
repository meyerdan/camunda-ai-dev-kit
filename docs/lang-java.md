# Java/Spring Boot Workers

Dependency: `io.camunda:camunda-spring-boot-starter`

```java
@Component
public class MyWorker {
    @JobWorker(type = "my-type")
    public Map<String, Object> handle(@Variable String input) {
        return Map.of("output", "value");
    }
    // BPMN error: throw new ZeebeBpmnError("CODE", "message")
    // Failure: throw any other exception
}
```

Auto-discovery: Spring Boot scans for `@JobWorker` beans. No explicit registration.
Auto-deploy: BPMN/DMN/Forms in `src/main/resources/` deploy on startup.

Config: see env module for `application.yaml` settings.
