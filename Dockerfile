FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install


FROM dependencies AS build

WORKDIR /app

COPY . .

RUN npm run build:production


FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache gettext

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/security-headers.conf /etc/nginx/security-headers.conf

COPY --from=build /app/dist/stock-market-dashboard/browser /usr/share/nginx/html

COPY docker/entrypoint/docker-entrypoint.sh /docker-entrypoint.d/40-generate-runtime-config.sh

RUN chmod +x /docker-entrypoint.d/40-generate-runtime-config.sh

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]