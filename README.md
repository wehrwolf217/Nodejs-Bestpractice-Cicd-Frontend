# 🚀 Next.js GitHub Actions CI/CD Best Practices

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Best%20Practices-blue?logo=github&logoColor=white)](https://docs.github.com/en/actions)
[![Next.js](https://img.shields.io/badge/Next.js-15-green?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4-blue?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-Trivy%20%2B%20Semgrep-red?logo=security&logoColor=white)](https://github.com/aquasecurity/trivy)

> A comprehensive GitHub Actions CI/CD pipeline demonstrating enterprise-grade best practices for Next.js frontend applications with automated versioning, security scanning, and static site deployment.

## 📋 Table of Contents

- [🔧 Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#-configuration)
- [✅ Next Steps](#-next-steps)
- [🏗️ Pipeline Architecture](#-pipeline-architecture)
- [🔄 Pipeline Jobs](#-pipeline-jobs)
- [📊 Generated Reports and Artifacts](#-generated-reports-and-artifacts)
- [🌿 Branch Strategy](#-branch-strategy)
- [📦 Versioning Strategy](#-versioning-strategy)
- [🆘 Troubleshooting](#-troubleshooting)
- [✨ Features](#-features)
- [🔒 Security Features](#-security-features)
- [📁 Project Structure](#-project-structure)
- [🏷️ Environment Variables](#-environment-variables)
- [🔧 Custom Actions](#-custom-actions)
- [📚 Best Practices Implemented](#-best-practices-implemented)

---

## 🔧 Prerequisites

Before getting started, ensure you have the following installed and configured:

- **Node.js** with **Yarn 4+** package manager
- **GitHub** account with repository access
- Basic understanding of CI/CD concepts
- Your Next.js application initialized and ready

## 🚀 Getting Started

### 1. Repository Setup

```bash
# Clone the repository
git clone https://gitlab.nixdev.co/github_ci/nodejs-bestpractice-ci-frontend-github.git temp_repo_name

```

### 2. Copy the CI/CD Configuration

Navigate to your project root directory and run the following commands:

```bash
# Copy the GitHub Actions configuration to your project
cp -r /path/to/temp_repo_name/.github .

# Install dependencies
corepack enable
corepack prepare yarn@4 --activate
yarn install

```

### 3: Configure Yarn for CI Cache

Create or update your `.yarnrc.yml` file in the project root with the following configuration:

```yaml
enableGlobalCache: false
yarnPath: .yarn/releases/yarn-4.9.2.cjs
```

This setting optimizes caching behavior in CI environments.

### 4: Configure GitHub Secrets and Variables

Set up the following in your GitHub repository settings:

- **Secrets**:
  - `GITHUB_TOKEN` (auto-provided for actions)

- **Variables**:
  - None required for basic setup

### 5: Push Code to Remote

```bash
git add .
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin main
```

### 6: Set Up Branch Protection and Approval Flow

To ensure code quality and security, protect the main branch with approval requirements.

1. Go to your repository's **Settings** tab.
2. Click **Branches** in the left sidebar.
3. If you see "Classic branch protections have not been configured", choose one of the options:
   - Click **Add classic branch protection rule** for the traditional method.
   - Or click **Add branch ruleset** for the new rules-based approach (recommended for advanced features).
   
   For this guide, we'll use the classic method: Click **Add classic branch protection rule**.
4. In "Branch name pattern", enter `main`.
5. Check the following options:
   - **Require a pull request before merging**
     - Require approvals: Check, set to 1
     - Dismiss stale pull request approvals when new commits are pushed: Check
     - Require review from Code Owners: Optional
     - Restrict who can dismiss pull request reviews: Check, select maintainers/owners
   - **Require status checks to pass before merging**: Check, add the following required checks:
     - `typecheck`
     - `format_check_new`
     - `lint`
     - `unit_test`
     - `yarn_audit`
     - `semgrep_scan`
     - `gitleaks_scan`
     - `build_and_upload_frontend`
   - **Include administrators**: Uncheck if you want to enforce for owners too
   - **Restrict pushes that create matching branches**: Optional (leave unchecked to allow branch creation)
   - **Allow force pushes**: Uncheck
   - **Allow deletions**: Uncheck
   
   Leave other options (like Require conversation resolution, Require signed commits, Require linear history, etc.) unchecked unless needed for your workflow.
6. Click **Create** or **Save changes**.

This prevents direct pushes to main, requiring all changes to go through pull requests with approval from at least 1 maintainer or owner, and passing all validation checks, tests, and security scans.

**Note**: Artifacts are pushed to the registry and tags are created only on push to main after PR approval/merge.

---

## ⚙️ Configuration

### Package.json Scripts

```json
{ 
  "name": "{project name}",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "lint": "next lint",
    "format": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "jest"
  }
}
```

### Next.js Configuration (next.config.ts)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## ✅ Next Steps

After completing the setup:

1. **Verify Pipeline**: Check your GitHub repository's Actions tab
2. **Configure Variables**: Set up necessary environment variables in GitHub
3. **Test Deployment**: Push a commit to trigger your first pipeline run
4. **Monitor Results**: Review pipeline logs and deployment status

---


## 🏗️ Pipeline Architecture

```mermaid
graph TD
    A[🌿 Branch Push/PR] --> B{Validation Block}
    B --> C{Install Block}
    C --> D{Code Quality Block}
    D --> E{Security & Test Block}
    E --> F{Build & Release Block}

    subgraph B["🔍 Validation Block"]
        B1((validate_branch_name))
        B2((validate_version_bump))
        B3((extract_version))
    end

    subgraph C["📦 Install Block"]
        C1((install_dependencies))
    end

    subgraph D["✨ Code Quality Block"]
        D1((lint))
        D2((format_check_new))
        D3((typecheck))
    end

    subgraph E["🛡️ Security & Test Block"]
        E1((yarn_audit))
        E2((semgrep_scan))
        E3((gitleaks_scan))
        E4((unit_test))
    end

    subgraph F["🏗️ Build & Release Block"]
        F1((build_and_upload_frontend))
        F2[📝 Builds static site, scans artifacts, and creates GitHub release]
    end

    style B fill:#e1f5fe
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#ffebee
    style F fill:#e3f2fd
```

## 🔄 Pipeline Jobs

The pipeline executes jobs in **sequential order** based on dependencies for optimal resource usage and clear failure points:

| Job                  | Dependencies                                                                 | Purpose                                              | Execution             | Runs On   |
| -------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------- | --------- |
| `validate_branch_name` | None                                                                          | Branch naming validation                             | Parallel              | PR + Main |
| `validate_version_bump` | None                                                                          | Semantic versioning checks                           | Parallel              | PR + Main |
| `extract_version`    | None                                                                          | Extract version from package.json                     | Parallel              | PR + Main |
| `install_dependencies` | `extract_version`, `validate_branch_name`, `validate_version_bump`           | Yarn 4 installation with caching                     | Sequential            | PR + Main |
| `lint`               | `install_dependencies`, `extract_version`                                     | ESLint code linting                                  | Parallel              | PR + Main |
| `format_check_new`   | `install_dependencies`, `extract_version`                                     | Prettier formatting check                            | Parallel              | PR + Main |
| `typecheck`          | `install_dependencies`, `extract_version`                                     | TypeScript type checking                             | Parallel              | PR + Main |
| `yarn_audit`         | `lint`, `format_check_new`, `typecheck`                                       | Yarn audit for vulnerabilities                        | Parallel              | PR + Main |
| `semgrep_scan`       | `lint`, `format_check_new`, `typecheck`                                       | SAST analysis with OWASP rules                       | Parallel              | PR + Main |
| `gitleaks_scan`      | `lint`, `format_check_new`, `typecheck`                                       | Secret detection scanning                            | Parallel              | PR + Main |
| `unit_test`          | `lint`, `format_check_new`, `typecheck`                                       | Unit test execution                                  | Sequential            | PR + Main |
| `build_and_upload_frontend` | `unit_test`, `extract_version`                                               | Next.js build, Trivy scan, and GitHub release (artifacts pushed and tagged only on push to main after PR approval)        | Sequential            | PR + Main |

## 📊 Generated Reports and Artifacts

The pipeline generates several reports and artifacts for monitoring, debugging, and compliance. These are uploaded to GitHub Actions and can be downloaded from the workflow run page.

### 📈 Available Artifacts

| Artifact Name          | Generated By          | Format   | Purpose                                                                 | Retention |
|------------------------|-----------------------|----------|-------------------------------------------------------------------------|-----------|
| `yarn-audit-report`    | `yarn_audit`          | JSON     | Dependency vulnerability report from Yarn audit                         | 2 days   |
| `semgrep-report`       | `semgrep_scan`        | JSON     | Static Application Security Testing (SAST) results with OWASP Top 10   | 2 days   |
| `gitleaks-report`      | `gitleaks_scan`       | JSON     | Secret detection report from GitLeaks                                   | 2 days   |
| `unit-test-report`     | `unit_test`           | XML      | Unit test results in JUnit format                                       | 2 days   |
| `trivy-fs-report`      | `build_and_upload_frontend` | SARIF | Build artifact vulnerability scan results                               | 2 days   |

### 📋 How to Access Artifacts

1. **Go to GitHub Actions**: Navigate to your repository's **Actions** tab
2. **Select Workflow Run**: Click on the specific workflow run
3. **Download Artifacts**: In the "Artifacts" section at the bottom, click to download any report
4. **View in GitHub**: SARIF reports (Trivy) are also viewable directly in GitHub's Security tab under "Code scanning alerts"

### 🔍 Report Details

- **Yarn Audit Report** (`yarn-audit-report.json`):
  - Lists critical dependency vulnerabilities
  - Includes severity levels and fix recommendations
  - Use for dependency security monitoring

- **Semgrep SAST Report** (`semgrep-SAST.json`):
  - OWASP Top 10 security findings
  - Code quality and security issues
  - Helps identify potential vulnerabilities in source code

- **GitLeaks Report** (`gitleaks-report.json`):
  - Detected secrets and sensitive data leaks
  - Commit history analysis results
  - Critical for preventing credential exposure

- **Unit Test Report** (`junit.xml`):
  - Test execution results
  - Pass/fail statistics
  - Can be integrated with test dashboards

- **Trivy FS Report** (`trivy-fs-results.sarif`):
  - Static build artifact vulnerabilities
  - HIGH and CRITICAL severity findings
  - Integrates with GitHub Security tab for alerts

### 💡 Usage Tips

- **Monitoring**: Regularly review reports for trends in vulnerabilities
- **CI/CD Integration**: Use reports to block deployments on critical issues
- **Compliance**: SARIF reports integrate with GitHub's security features
- **Debugging**: Download artifacts to analyze failed pipeline runs

## 🌿 Branch Strategy

### Naming Convention

```bash
✅ feature/user-authentication
✅ feature/api-optimization
✅ fix/memory-leak-issue
✅ fix/validation-bug

❌ bugfix/something
❌ feat/new-feature
❌ random-branch-name
```

### Version Bump Requirements

| Branch Type | Version Bump        | Example           |
| ----------- | ------------------- | ----------------- |
| `feature/*` | **Minor** increment | `1.2.3` → `1.3.0` |
| `fix/*`     | **Patch** increment | `1.2.3` → `1.2.4` |

## 📦 Versioning Strategy

The pipeline implements **Semantic Versioning (SemVer)** with automated validation:

```json
{
  "version": "1.2.3",
  "// ": "MAJOR.MINOR.PATCH"
}
```

- **MAJOR**: Breaking changes (for now we should use also `feature/*` branches)
- **MINOR**: New features (`feature/*` branches)
- **PATCH**: Bug fixes (`fix/*` branches)

## 🆘 Troubleshooting

If you encounter issues:

- Ensure all prerequisites are properly installed
- Verify GitHub repository permissions
- Check that required environment variables are configured
- Review pipeline logs for specific error messages

## ✨ Features

### 🎯 **Automated Workflows**

- **Smart Branch Validation** - Enforces `feature/*` and `fix/*` naming conventions
- **Semantic Versioning** - Automatic version bump validation based on branch type
- **Git Tagging** - Automated release tagging on main branch
- **Dependency Caching** - Intelligent Yarn 4 cache management

### 🛡️ **Security First**

- **Vulnerability Scanning** - Yarn audit for npm dependencies
- **Secret Detection** - GitLeaks integration for credential scanning
- **SAST Analysis** - Semgrep with OWASP Top 10 rules
- **Build Artifact Security** - Trivy scanning for built static files

### 🏗️ **Code Quality**

- **Linting** - ESLint integration with Next.js rules
- **Formatting** - Prettier code formatting validation
- **Type Safety** - TypeScript type checking
- **Testing** - Jest testing framework

### 📦 **Static Site Deployment**

- **Static Export** - Next.js static site generation
- **Artifact Archiving** - Automated build artifact creation
- **GitHub Releases** - Direct deployment to GitHub releases
- **Cross-platform** - Static files compatible with any hosting


## 🔒 Security Features

### 🔍 Multi-Layer Security Scanning

1. **Dependency Vulnerabilities**

   ```bash
   yarn npm audit --severity critical
   ```

2. **Static Application Security Testing**

   ```bash
   semgrep scan --config p/owasp-top-ten
   ```

3. **Secret Detection**

   ```bash
   gitleaks detect --exit-code 1
   ```

4. **Build Artifact Security**
   ```bash
   trivy fs --severity HIGH,CRITICAL
   ```

### 🛡️ Security Gates

- **Critical vulnerabilities** block pipeline progression
- **Secret leaks** prevent code commits
- **OWASP Top 10** compliance validation
- **Build artifact CVEs** scanning before release

## 📁 Project Structure

```
your-nextjs-project/
├── 📄 .github/workflows/.github-ci.yml  # CI/CD Pipeline
├── 📦 package.json                      # Dependencies & scripts
├── 🧶 yarn.lock                        # Dependency lock
├── ⚙️ .yarnrc.yml                      # Yarn configuration
├── 📝 next.config.ts                    # Next.js configuration
├── 🔍 eslint.config.mjs                 # Linting rules
├── 💅 .prettierignore                   # Prettier ignore rules
├── 🧪 jest.config.ts                    # Jest configuration
├── 🧪 jest.setup.ts                     # Jest setup
├── 📁 .github/actions/                  # Custom GitHub Actions
│   ├── setup-node/action.yml            # Node.js setup action
│   └── code-quality/action.yml          # Code quality action
├── 📁 src/                              # Source code
├── 🧪 __tests__/                        # Test files
└── 📖 README.md                         # This file
```


## 🏷️ Environment Variables

### Pipeline Variables

| Variable      | Purpose                     | Example                            |
| ------------- | --------------------------- | ---------------------------------- |
| `VERSION`     | Extracted from package.json | `1.2.3`                            |
| `PACKAGE_NAME`| Set custom artifact name    | `my-frontend-app`                  |

### Branch-Specific Variables

- `github.head_ref` - Source branch in PR
- `github.ref` - Current branch name
- `github.event_name` - Event type (push, pull_request)

## 🔧 Custom Actions

### Setup Node Action (.github/actions/setup-node/action.yml)

This composite action sets up Node.js 22, enables Corepack, prepares Yarn v4, and configures caching.

**Inputs:**
- `node-version` (default: '22'): Node.js version to install
- `yarn-version` (default: '4.9.2'): Yarn version to prepare

**Features:**
- Uses `actions/setup-node@v5` for Node.js installation
- Enables Corepack for Yarn management
- Prepares specified Yarn version
- Configures caching for Yarn dependencies (.yarn/, .pnp.cjs, .pnp.loader.mjs)

**Usage:**
```yaml
- name: Setup Node with Yarn
  uses: ./.github/actions/setup-node
  with:
    node-version: '22'
    yarn-version: '4.9.2'
```

### Code Quality Action (.github/actions/code-quality/action.yml)

This composite action sets up Node with Yarn and runs specified code quality commands.

**Inputs:**
- `command` (required): The yarn command to run (e.g., lint, format, typecheck)

**Features:**
- Calls the setup-node action for environment setup
- Runs the specified yarn command
- Supports linting, formatting, and type checking

**Usage:**
```yaml
- name: Run Lint
  uses: ./.github/actions/code-quality
  with:
    command: lint
```

## 📚 Best Practices Implemented

### ✅ **Pipeline Optimization**

- **Smart Caching** - Yarn cache with lock file keys
- **Job-wise Execution** - Sequential jobs with parallel execution based on dependencies
- **Conditional Jobs** - PR vs Main branch logic
- **Fail-Fast** - Early pipeline termination on critical issues
- **Resource Efficiency** - Jobs can run parallel when dependencies allow

### ✅ **Security Best Practices**

- **Shift-Left Security** - Early vulnerability detection
- **Multi-layered Scanning** - Dependencies, code, secrets, build artifacts
- **Zero-Trust** - No security check bypassing
- **Automated Remediation** - Block deployments on security issues

### ✅ **Code Quality Standards**

- **Consistent Formatting** - Prettier integration
- **Linting Rules** - ESLint with Next.js rules
- **Type Safety** - TypeScript strict mode
- **Test Coverage** - Jest testing framework

### ✅ **Static Site Best Practices**

- **Static Export** - Optimized for static hosting
- **Artifact Security** - Pre-deployment vulnerability scanning
- **Release Management** - Automated GitHub releases
- **Cross-platform Compatibility** - Static files work anywhere

### ✅ **Git Workflow**

- **Branch Protection** - Naming convention enforcement
- **Semantic Versioning** - Automated version management
- **Release Automation** - GitHub releases on main
- **Pull Request Gates** - Quality checks before merge

---
