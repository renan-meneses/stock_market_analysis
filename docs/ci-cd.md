# CI/CD Pipeline

## Overview

The project uses GitHub Actions for continuous integration and deployment.

## Workflows

### Continuous Integration (continuous-integration.yml)

Runs on push/PR to main/develop:
- TypeScript type checking
- ESLint
- Unit tests
- Production build
- Dependency audit
- Docker build validation
- Kubernetes manifest validation

### Docker Build (docker-build.yml)

Runs on push to main or version tags:
- Builds multi-architecture Docker images
- Tags by commit SHA and semantic version
- Pushes to GitHub Container Registry (ghcr.io)
- Caches layers for faster builds

### Kubernetes Deploy (kubernetes-deploy.yml)

Manual workflow (workflow_dispatch):
- Targets development, staging, or production
- Runs `kubectl diff` before applying
- Waits for rollout completion
- Fails if health checks don't pass

### Vercel Deploy (vercel-deploy.yml)

- Production: Auto-deploy on push to main
- Preview: Auto-deploy on pull request
- Uses Vercel native Git integration

## Required Secrets

| Secret | Description |
|--------|-------------|
| VERCEL_TOKEN | Vercel API token |
| VERCEL_ORG_ID | Vercel organization ID |
| VERCEL_PROJECT_ID | Vercel project ID |
| KUBE_CONFIG | Kubernetes cluster kubeconfig |
| BRAPI_TOKEN | Brapi API token (stored per-environment) |
