# Helm Deployment

## Prerequisites

- Helm v3+
- Kubernetes cluster

## Installing the Chart

```bash
# Deploy with default values
helm install financial-dashboard ./deploy/helm/financial-dashboard

# Deploy to development
helm install financial-dashboard ./deploy/helm/financial-dashboard \
  --values ./deploy/helm/financial-dashboard/values-development.yaml

# Deploy to production
helm install financial-dashboard ./deploy/helm/financial-dashboard \
  --values ./deploy/helm/financial-dashboard/values-production.yaml
```

## Upgrading

```bash
helm upgrade financial-dashboard ./deploy/helm/financial-dashboard \
  --values ./deploy/helm/financial-dashboard/values-production.yaml
```

## Configuration

Key values that can be configured:

| Parameter | Description | Default |
|-----------|-------------|---------|
| frontend.replicas | Frontend replica count | 2 |
| backend.replicas | Backend replica count | 2 |
| frontend.image.repository | Frontend image repository | stock-market-dashboard/frontend |
| backend.image.repository | Backend image repository | stock-market-dashboard/financial-api |
| ingress.hostname | Ingress hostname | dashboard.example.com |
| autoscaling.frontend.enabled | Enable frontend HPA | true |
