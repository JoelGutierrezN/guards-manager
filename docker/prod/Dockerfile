ARG NODE_VERSION=24.14.0-alpine
ARG NGINX_VERSION=1.27-alpine

FROM node:${NODE_VERSION} AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build

FROM nginx:${NGINX_VERSION} AS prod

COPY docker/prod/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
