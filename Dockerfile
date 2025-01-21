# Stage 1: Build the application
FROM oven/bun:slim AS builder
WORKDIR /app
COPY . /app
RUN bun install
RUN bun run build

# Stage 2: Run the application
FROM oven/bun:slim AS runner
WORKDIR /app
COPY --from=builder /app/dist /app
COPY --from=builder /app/.env /app/.env
EXPOSE 5000

# Use "bun run" to execute the built application
CMD ["bun", "run", "index.js"]
