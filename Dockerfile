FROM oven/bun:slim AS builder
WORKDIR /app
COPY . /app
RUN bun install
CMD [ "bun","run", "build" ]

FROM oven/bun:slim AS runner
WORKDIR /app
COPY --from=BUILDER /app/dist /app
COPY --from=BUILDER /app/.env /app/.env
EXPOSE 5000
CMD [ "bun", "run", "index.js" ]