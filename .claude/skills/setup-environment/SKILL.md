---
name: setup-environment
description: Install and start Camunda 8 Run locally for development. Downloads the latest version, verifies Java, and starts the engine.
---

Set up a local Camunda 8 development environment using C8 Run.

## Steps

### 1. Check if C8 Run is already running
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/v2/topology
```
If HTTP 200: C8 Run is already running. Skip to step 6 (install c8ctl if needed), then print the summary.

### 2. Check Java
Camunda 8 Run requires **OpenJDK 21-23**. Check with `java -version`. If missing or wrong version, tell the user to install JDK 21+ and set JAVA_HOME.

### 3. Find the latest C8 Run version
Each minor version directory (e.g. `8.9/`) is a shortcut to the latest sub-release in that line (alpha, patch, etc.). Pick the highest minor version:

```bash
curl -s https://downloads.camunda.cloud/release/camunda/c8run/ | grep -o '"[0-9]\.[0-9][0-9]*/"' | tr -d '"' | sort -t. -k1,1n -k2,2n | tail -1 | tr -d '/'
```

This returns e.g. `8.9`. Use this as the version in the download URL.

### 4. Download for the current platform
Base URL: `https://downloads.camunda.cloud/release/camunda/c8run/{version}/`

File naming: `camunda8-run-{version}-{os}-{arch}.{ext}`

| Platform | os | arch | ext |
|----------|-----|------|-----|
| macOS Apple Silicon | darwin | aarch64 | zip |
| macOS Intel | darwin | x86_64 | zip |
| Linux | linux | x86_64 | tar.gz |
| Windows | windows | x86_64 | zip |

Detect platform with `uname -s` and `uname -m` (map arm64 → aarch64, x86_64 stays).

Download to a temp location, extract to `~/camunda/c8run` (or ask user for preferred location). The zip may extract to a versioned directory name (e.g. `c8run-8.9.0-alpha4/`) — rename it to `c8run`. Do NOT search the user's filesystem for existing installations.

### 5. Start C8 Run
```bash
cd ~/camunda/c8run && ./start.sh
```
Wait for startup (can take 30-60 seconds), then verify:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/v2/topology
```

### 6. Install c8ctl
Check if already installed with `c8 --version`. If not:
```bash
npm install @camunda8/cli -g
```

### 7. Summary
Print the URLs:
- REST API: http://localhost:8080/v2/
- Operate: http://localhost:8080/operate
- Tasklist: http://localhost:8080/tasklist
- Zeebe gRPC: localhost:26500

No authentication required. Default credentials for web UIs: demo/demo.
