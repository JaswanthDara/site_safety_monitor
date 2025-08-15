# 🛡️ Site Safety Monitor

This is a Node.js project named **site_safety_monitor**, configured with GitHub Actions for CI/CD and deployed on an EC2 server using PM2.

---

## 🚀 Features

- GitHub Actions CI pipeline
- Automatically installs dependencies and runs tests on every push/PR to `main`
- Deployed on AWS EC2 using PM2
- Accessible via public IP

---

## 🧰 Technologies Used

- Node.js
- GitHub Actions
- PM2
- AWS EC2

---

## ⚙️ GitHub Actions Workflow

Located at: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
