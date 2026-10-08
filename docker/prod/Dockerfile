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

# Sin `--build-arg`, `ENV` deja la variable como cadena vacía y Vite hornearía un
# `API_BASE_URL` vacío: la imagen se publicaría rota (toda petición caería en el
# propio nginx del front). Mejor fallar aquí que en el navegador.
RUN test -n "$VITE_API_URL" || { echo 'Falta --build-arg VITE_API_URL' >&2; exit 1; }

RUN pnpm build

FROM nginx:${NGINX_VERSION} AS prod

COPY docker/prod/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
