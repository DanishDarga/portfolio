# AWS EC2 Dockerized CI/CD Pipeline for Personal Portfolio Website

This repository implements a fully automated, professional DevOps CI/CD pipeline that validates, containerizes, and deploys a premium personal portfolio website to an **AWS EC2** instance using **GitHub Actions** and **Docker**.

---

## 🚀 Pipeline Architecture

The workflow automates the entire software delivery lifecycle from commit to live hosting:

```mermaid
graph TD
    A[Developer Push] -->|Triggers Workflow| B(GitHub Actions Runner)
    subgraph CI Quality Gates
        B --> C[npm install]
        C --> D[HTMLHint Validation]
        C --> E[ESLint JS Checks]
        C --> F[Stylelint CSS Checks]
        C --> G[Prettier Formatting Check]
    end
    subgraph CD Containerization & Push
        D & E & F & G --> H[Docker Build]
        H --> I[Push to Docker Hub Registry]
    end
    subgraph CD Remote VM Deployment
        I --> J[SSH Handshake to AWS EC2]
        J --> K[Docker Pull Registry Image]
        K --> L[Stop & Remove Old Container]
        L --> M[Start Container: Host Port 80]
    end
    M --> N[Live Portfolio Website]
```

---

## 🛠️ Infrastructure Setup

### 1. Provisioning AWS EC2 Instance
1. Go to your **AWS Console** -> **EC2 Dashboard** -> **Launch Instance**.
2. **Name**: `portfolio-web-host`.
3. **OS Image**: Select **Ubuntu Server 22.04 LTS** (Free Tier Eligible).
4. **Instance Type**: `t2.micro` (Free Tier Eligible).
5. **Key Pair**: Create a new key pair or select an existing one (e.g., `portfolio-key.pem`). Save this file securely.
6. **Network Settings (Security Groups)**:
   - Allow **SSH traffic** from Anywhere (or your IP) to access port 22.
   - Allow **HTTP traffic** from Anywhere to access port 80.
7. Click **Launch Instance**.

### 2. GitHub Secrets Setup
To enable the pipeline to securely communicate with Docker Hub and your EC2 instance, navigate to your repository on GitHub -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret** and add the following:

| Secret Name | Value Description |
| :--- | :--- |
| `DOCKER_USERNAME` | Your Docker Hub account username. |
| `DOCKER_PASSWORD` | Your Docker Hub password or Personal Access Token (PAT). |
| `EC2_HOST` | The **Public IPv4 Address** or **Public IPv4 DNS** of your EC2 instance. |
| `EC2_USERNAME` | The SSH username for your instance (typically `ubuntu` for Ubuntu OS). |
| `EC2_SSH_KEY` | The exact contents of your private key `.pem` file (include `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`). |

---

## 💻 Local Development & Quality Controls

You can run the same linting, formatting, and containerization checks locally before pushing to GitHub.

### Setup Dependencies
First, ensure you have [Node.js](https://nodejs.org/) installed. Run:
```bash
npm install
```

### Run Code Quality Gates
Execute the following verification scripts locally:
```bash
# Validate HTML structure
npm run lint:html

# Check JavaScript code style
npm run lint:js

# Verify CSS architecture and rules
npm run lint:css

# Check formatting styling
npm run format:check

# Run ALL quality checks simultaneously
npm run lint

# Auto-correct formatting discrepancies
npm run format:write
```

### Local Container Verification
Verify the Docker container build and run behavior locally:
```bash
# Build the Docker image locally
docker build -t portfolio-local .

# Run the container mapping host port 8080 to container port 80
docker run -d -p 8080:80 --name portfolio-test portfolio-local

# Visit http://localhost:8080 in your web browser to check the site.
# To clean up:
docker stop portfolio-test && docker rm portfolio-test
```

---

## 🖥️ Live Terminal Sandbox Command
Once deployed, visitors can inspect the pipeline's operational telemetry directly from the website's custom CLI sandbox. 
1. Open the portfolio website.
2. Navigate to the **Terminal** section.
3. Type the command:
   ```bash
   pipeline
   ```
   This will simulate the live step-by-step verification, compilation, registry upload, and remote EC2 VM deployment sequence.
