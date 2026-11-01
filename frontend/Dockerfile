FROM node:26-alpine AS build
WORKDIR /workspace
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
ARG VITE_PLATFORM_API_BASE_URL=http://localhost:8080/api/v1
ARG VITE_AI_SERVICE_BASE_URL=http://localhost:8000/api/v1
ENV VITE_PLATFORM_API_BASE_URL=$VITE_PLATFORM_API_BASE_URL
ENV VITE_AI_SERVICE_BASE_URL=$VITE_AI_SERVICE_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
ENV NGINX_ENVSUBST_FILTER=^CSP_CONNECT_SOURCES$
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/index.html || exit 1
