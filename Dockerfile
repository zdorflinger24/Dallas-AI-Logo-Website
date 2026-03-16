# Stage 1: Build frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production
FROM python:3.11-slim
WORKDIR /app

# Install Python dependencies
COPY tools/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY tools/ ./tools/

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Cloud Run uses PORT env var
ENV PORT=8080
EXPOSE 8080

CMD ["python", "-m", "uvicorn", "tools.api_server:app", "--host", "0.0.0.0", "--port", "8080"]
