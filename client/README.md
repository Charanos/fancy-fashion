# Roi Stationares Client

Frontend-first Next.js storefront for the ecommerce tutorial.

## Package Manager

This client uses pnpm.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 after the dev server is ready.

## Checks

```bash
pnpm run lint
pnpm exec tsc --noEmit
pnpm run build
```

## Icons

Use Tabler React icons only. Import shared app icons from:

```ts
import { IconSearch, IconShoppingCart } from "./components/icons";
```

Add new exports to `src/app/components/icons.ts` when the UI needs more icons.
