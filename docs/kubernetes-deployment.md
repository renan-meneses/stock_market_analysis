# Kubernetes Deployment

## Prerequisites

- kubectl
- Kustomize (built into kubectl)
- Kubernetes cluster (v1.24+)

## Deploying with Kustomize

```bash
# Deploy to development
kubectl apply -k deploy/kubernetes/overlays/development

# Deploy to staging
kubectl apply -k deploy/kubernetes/overlays/staging

# Deploy to production
kubectl apply -k deploy/kubernetes/overlays/production

# View resources
kubectl get all -n financial-dashboard
```

## Brapi Token (Kubernetes Secret)

Create the secret with your real token:

```bash
kubectl create secret generic financial-api-secrets \
  --namespace financial-dashboard \
  --from-literal=BRAPI_TOKEN=your-real-token-here
```

## Alternative Secret Management

For production, consider using:
- **Sealed Secrets**: Encrypt secrets into SealedSecret resources
- **External Secrets Operator**: Sync secrets from AWS Secrets Manager, GCP Secret Manager, etc.
- **HashiCorp Vault**: Dynamic secret management with Vault Agent Sidecar

## Scaling

The HorizontalPodAutoscaler automatically scales based on:
- Frontend: CPU utilization (target: 70%)
- Backend: CPU and memory utilization (targets: 70% CPU, 80% memory)

## Health Checks

Three probe types configured:
- **Startup Probe**: `/ready` - allows slow-starting containers
- **Liveness Probe**: `/health` - restarts unhealthy containers
- **Readiness Probe**: `/ready` - stops traffic to unready pods
