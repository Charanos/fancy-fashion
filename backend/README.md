# Lama Monorepo Tutorial Foundation

Starter workspace for the microservices e-commerce tutorial.

## What is included

- `apps/admin`: Next.js admin shell
- `services/product`: Express API on port `4000`
- `services/order`: Fastify API on port `4001`
- `services/payment`: Hono API on port `4002`
- `packages/common`: shared TypeScript helpers and Zod schemas
- `packages/tsconfig`: shared TypeScript configs
- `compose.yaml`: PostgreSQL, MongoDB, and Kafka for local infrastructure

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```

Local URLs:

- Admin: http://localhost:3000
- Product health: http://localhost:4000/health
- Order health: http://localhost:4001/health
- Payment health: http://localhost:4002/health

## Infrastructure

Start Docker Desktop first, then run:

```bash
pnpm infra:up
pnpm infra:logs
pnpm infra:down
```

The compose file provides:

- PostgreSQL: `postgresql://lama:lama@localhost:5432/product_service?schema=public`
- MongoDB: `mongodb://lama:lama@localhost:27017/order_service?authSource=admin`
- Kafka broker: `localhost:9092`

## Environment

Copy `.env.example` to `.env` when the tutorial reaches real integrations like Clerk,
Stripe, Prisma, Kafka, and webhooks.
