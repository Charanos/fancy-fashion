# Tutorial Tooling Map

This repo is prepared for the microservices e-commerce tutorial stack:

- Monorepo: Turborepo with pnpm workspaces
- Language/runtime: TypeScript on Node.js
- Services: Express product service, Fastify order service, Hono payment/auth-style service
- Databases: PostgreSQL for products, MongoDB for orders
- ORM/data access: Prisma can be added per service when the tutorial reaches schemas
- Integrations: Clerk, Stripe, Kafka, Nodemailer, Zod, React Hook Form
- Testing during tutorial: Requestly, curl, or any API client
- Local infra: Docker Compose for PostgreSQL, MongoDB, and Kafka

Use `corepack pnpm` on this machine if `pnpm` is not available directly.
