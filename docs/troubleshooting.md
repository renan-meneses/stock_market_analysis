# Troubleshooting

## Common Issues

### CORS Errors

If providers block browser requests:
1. Ensure the backend proxy is running
2. Verify the proxy URL is correctly configured
3. Check CORS headers in Nginx/API configuration
4. For development, use the proxy configured in angular.json

### Provider Not Responding

If a provider returns errors:
1. Check provider status at `/api/market/providers/health`
2. Verify network connectivity to provider URLs
3. Check rate limits haven't been exceeded
4. Check the Brapi token is valid and not expired

### Brapi Token Issues

If Brapi returns authentication errors:
1. Verify `BRAPI_TOKEN` is set in the environment
2. Check the token is not exposed in client-side code
3. For Kubernetes: verify the Secret exists and is mounted correctly
4. For Vercel: verify the server-side environment variable is set
5. Regenerate the token at https://brapi.dev if needed

### Docker Issues

If Docker containers fail to start:
1. Run `docker compose logs` to see error output
2. Ensure all required environment variables are set in `.env`
3. Check port 8080 and 8000 are not already in use
4. Rebuild images with `docker compose build --no-cache`

### Kubernetes Issues

If pods fail to start:
1. Run `kubectl describe pod <pod-name> -n financial-dashboard`
2. Run `kubectl logs <pod-name> -n financial-dashboard`
3. Check Secret exists: `kubectl get secrets -n financial-dashboard`
4. Verify ConfigMap values: `kubectl get configmap -n financial-dashboard`
