# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production

# Pass build arguments to environment variables
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_TOMTOM_API_KEY
ARG NEXT_PUBLIC_FUSEKI_URL

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_TOMTOM_API_KEY=$NEXT_PUBLIC_TOMTOM_API_KEY
ENV NEXT_PUBLIC_FUSEKI_URL=$NEXT_PUBLIC_FUSEKI_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/out /usr/share/nginx/html
# Default nginx port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
