# AgentFlow Deployment Guide

## Overview

This guide covers deploying AgentFlow in various environments, from local development to production Kubernetes clusters.

## Prerequisites

### Required Tools

- **Docker**: 20.10+ with Docker Compose
- **Kubernetes**: 1.24+ (for production)
- **kubectl**: Kubernetes command-line tool
- **Helm**: 3.0+ (optional, for package management)
- **PostgreSQL**: 15+ (if not using containerized version)
- **Redis**: 7+ (if not using containerized version)

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **Memory**: 4GB RAM
- **Storage**: 20GB available space
- **Network**: Internet connection for external APIs

#### Recommended Requirements
- **CPU**: 4+ cores
- **Memory**: 8GB+ RAM
- **Storage**: 50GB+ SSD
- **Network**: High-speed internet connection

## Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/agentflow/agentflow.git
   cd agentflow
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development Setup

#### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://agentflow:password@localhost:5432/agentflow
REDIS_URL=redis://localhost:6379

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
DEBUG=true

# Security
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Monitoring
MONITORING_ENABLED=false
PROMETHEUS_PORT=8001

# CORS
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Logging
LOG_LEVEL=DEBUG
LOG_FORMAT=json
```

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
VITE_APP_NAME=AgentFlow
VITE_APP_VERSION=1.0.0
```

## Docker Deployment

### Single Container Deployment

1. **Build the application**
   ```bash
   # Build backend
   docker build -t agentflow/backend:latest backend/
   
   # Build frontend
   docker build -t agentflow/frontend:latest frontend/
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Docker Compose Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    image: agentflow/frontend:latest
    ports:
      - "80:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    image: agentflow/backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://agentflow:password@postgres:5432/agentflow
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=agentflow
      - POSTGRES_USER=agentflow
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Kubernetes Deployment

### Prerequisites

1. **Set up Kubernetes cluster**
   ```bash
   # Using minikube for local testing
   minikube start --cpus=4 --memory=8192
   
   # Or use cloud provider (GKE, EKS, AKS)
   ```

2. **Install required tools**
   ```bash
   # Install kubectl
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   
   # Install Helm (optional)
   curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
   ```

### Deploy to Kubernetes

1. **Create namespace**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Deploy secrets**
   ```bash
   # Create secrets file
   kubectl create secret generic agentflow-secrets \
     --from-literal=jwt-secret=your-jwt-secret-key \
     --from-literal=database-password=your-db-password \
     --from-literal=redis-password=your-redis-password \
     --namespace=agentflow
   ```

3. **Deploy configuration**
   ```bash
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/pvc.yaml
   ```

4. **Deploy services**
   ```bash
   kubectl apply -f k8s/postgres.yaml
   kubectl apply -f k8s/redis.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

5. **Deploy ingress**
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

6. **Deploy monitoring**
   ```bash
   kubectl apply -f k8s/monitoring.yaml
   ```

### Verify Deployment

```bash
# Check pod status
kubectl get pods -n agentflow

# Check services
kubectl get services -n agentflow

# Check ingress
kubectl get ingress -n agentflow

# View logs
kubectl logs -f deployment/agentflow-backend -n agentflow
```

## Production Deployment

### Cloud Provider Setup

#### AWS (EKS)

1. **Create EKS cluster**
   ```bash
   eksctl create cluster \
     --name agentflow-cluster \
     --region us-west-2 \
     --nodegroup-name worker-nodes \
     --node-type t3.medium \
     --nodes 3 \
     --nodes-min 1 \
     --nodes-max 5
   ```

2. **Configure kubectl**
   ```bash
   aws eks update-kubeconfig --region us-west-2 --name agentflow-cluster
   ```

3. **Deploy application**
   ```bash
   kubectl apply -f k8s/
   ```

#### Google Cloud (GKE)

1. **Create GKE cluster**
   ```bash
   gcloud container clusters create agentflow-cluster \
     --zone us-central1-a \
     --num-nodes 3 \
     --machine-type e2-medium
   ```

2. **Get credentials**
   ```bash
   gcloud container clusters get-credentials agentflow-cluster --zone us-central1-a
   ```

3. **Deploy application**
   ```bash
   kubectl apply -f k8s/
   ```

#### Azure (AKS)

1. **Create AKS cluster**
   ```bash
   az aks create \
     --resource-group agentflow-rg \
     --name agentflow-cluster \
     --node-count 3 \
     --node-vm-size Standard_B2s
   ```

2. **Get credentials**
   ```bash
   az aks get-credentials --resource-group agentflow-rg --name agentflow-cluster
   ```

3. **Deploy application**
   ```bash
   kubectl apply -f k8s/
   ```

### Production Configuration

#### Environment Variables

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agentflow-config
  namespace: agentflow
data:
  DATABASE_URL: "postgresql://agentflow:password@postgres:5432/agentflow"
  REDIS_URL: "redis://redis:6379"
  ENVIRONMENT: "production"
  DEBUG: "false"
  MONITORING_ENABLED: "true"
  ALLOWED_HOSTS: "agentflow.example.com,api.agentflow.com"
  LOG_LEVEL: "INFO"
  LOG_FORMAT: "json"
```

#### Resource Limits

```yaml
# k8s/deployment.yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

#### Health Checks

```yaml
# k8s/deployment.yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### SSL/TLS Configuration

#### Using cert-manager

1. **Install cert-manager**
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
   ```

2. **Create ClusterIssuer**
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       server: https://acme-v02.api.letsencrypt.org/directory
       email: admin@agentflow.com
       privateKeySecretRef:
         name: letsencrypt-prod
       solvers:
       - http01:
           ingress:
             class: nginx
   ```

3. **Update ingress with TLS**
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: agentflow-ingress
     annotations:
       cert-manager.io/cluster-issuer: "letsencrypt-prod"
   spec:
     tls:
     - hosts:
       - agentflow.example.com
       secretName: agentflow-tls
   ```

## Monitoring and Observability

### Prometheus Setup

1. **Deploy Prometheus**
   ```bash
   kubectl apply -f k8s/monitoring.yaml
   ```

2. **Access Prometheus**
   ```bash
   kubectl port-forward service/agentflow-prometheus-service 9090:9090 -n agentflow
   # Access at http://localhost:9090
   ```

### Grafana Setup

1. **Deploy Grafana**
   ```bash
   kubectl apply -f monitoring/grafana/
   ```

2. **Access Grafana**
   ```bash
   kubectl port-forward service/grafana 3000:3000 -n agentflow
   # Access at http://localhost:3000
   # Default credentials: admin/admin
   ```

### Log Aggregation

#### Using Fluentd

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*agentflow*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      format json
    </source>
    
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      index_name agentflow
    </match>
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
kubectl exec -it postgres-0 -n agentflow -- pg_dump -U agentflow agentflow > backup.sql

# Restore backup
kubectl exec -i postgres-0 -n agentflow -- psql -U agentflow agentflow < backup.sql
```

### Automated Backups

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: agentflow-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              pg_dump -h postgres -U agentflow agentflow > /backup/backup-$(date +%Y%m%d).sql
              aws s3 cp /backup/backup-$(date +%Y%m%d).sql s3://agentflow-backups/
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage-claim
```

## Troubleshooting

### Common Issues

#### Pod Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n agentflow

# Check logs
kubectl logs <pod-name> -n agentflow

# Check events
kubectl get events -n agentflow --sort-by='.lastTimestamp'
```

#### Database Connection Issues

```bash
# Check database pod
kubectl get pods -n agentflow | grep postgres

# Check database logs
kubectl logs postgres-0 -n agentflow

# Test connection
kubectl exec -it postgres-0 -n agentflow -- psql -U agentflow -d agentflow -c "SELECT 1;"
```

#### Service Not Accessible

```bash
# Check service
kubectl get services -n agentflow

# Check ingress
kubectl get ingress -n agentflow

# Check ingress controller
kubectl get pods -n ingress-nginx
```

### Performance Issues

#### High Memory Usage

```bash
# Check resource usage
kubectl top pods -n agentflow

# Check node resources
kubectl top nodes

# Scale up if needed
kubectl scale deployment agentflow-backend --replicas=5 -n agentflow
```

#### Slow Database Queries

```bash
# Connect to database
kubectl exec -it postgres-0 -n agentflow -- psql -U agentflow -d agentflow

# Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# Check indexes
\d+ workflows
```

## Security Considerations

### Network Security

- **Network Policies**: Restrict pod-to-pod communication
- **Ingress Security**: Use HTTPS and security headers
- **Service Mesh**: Consider Istio for advanced security

### Data Security

- **Encryption at Rest**: Enable database encryption
- **Encryption in Transit**: Use TLS for all communications
- **Secrets Management**: Use external secret management (Vault, AWS Secrets Manager)

### Access Control

- **RBAC**: Implement role-based access control
- **Service Accounts**: Use dedicated service accounts
- **Pod Security**: Apply pod security standards

## Maintenance

### Regular Updates

```bash
# Update application
kubectl set image deployment/agentflow-backend agentflow-backend=agentflow/backend:v1.1.0 -n agentflow

# Update database
kubectl exec -it postgres-0 -n agentflow -- psql -U agentflow -d agentflow -c "ALTER DATABASE agentflow SET default_transaction_isolation = 'read committed';"
```

### Scaling

```bash
# Horizontal scaling
kubectl scale deployment agentflow-backend --replicas=10 -n agentflow

# Vertical scaling
kubectl patch deployment agentflow-backend -n agentflow -p '{"spec":{"template":{"spec":{"containers":[{"name":"agentflow-backend","resources":{"requests":{"memory":"1Gi","cpu":"500m"},"limits":{"memory":"2Gi","cpu":"1000m"}}}]}}}}'
```

This deployment guide provides comprehensive instructions for deploying AgentFlow in various environments, from local development to production Kubernetes clusters.








