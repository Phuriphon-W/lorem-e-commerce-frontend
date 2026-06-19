# Lorem E-Commerce Frontend

E-commerce web application built with Next.js 16, React 19, and TypeScript — featuring JWT authentication, Stripe checkout, real-time WebSocket notifications, and an admin back-office dashboard.

## Architecture Summary

The application follows a modular, feature-driven architecture using the Next.js App Router:

- **Route Groups:** `(auth)` for public sign-in/sign-up flows, `(backoffice)` for the admin dashboard, and top-level routes for the customer-facing storefront.
- **API Layer:** Centralized Axios-based modules (`apis/`) with cookie passthrough for SSR and a keyword-based error sanitizer that maps raw backend messages to user-friendly strings.
- **Authentication:** JWT tokens stored in httpOnly cookies, verified server-side via `jose` in Next.js middleware (`proxy.ts`), with role-based routing (admin → backoffice, customer → storefront).
- **Real-Time:** WebSocket context provider for server-pushed events (e.g., order expiration notifications).
- **Theming:** Dual Ant Design theme — gold/amber for the storefront, dark navy for auth pages — configured via `ConfigProvider` at the layout level.
- **State Management:** URL-driven state for pagination/filtering (shareable URLs) and React Context for auth and WebSocket state.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | `^5` |
| Runtime | Node.js | `22.x` |
| Framework | Next.js (App Router) | `16.2.6` |
| React | React | `19.2.3` |
| UI Library | Ant Design | `^6.3.2` |
| Styling | Tailwind CSS | `^4` |
| Animations | Framer Motion | `^12.38.0` |
| Icons | Font Awesome | `^7.2.0` |
| HTTP Client | Axios | `^1.15.2` |
| Auth (JWT) | jose | `^6.2.1` |
| Carousel | Embla Carousel | `^8.6.0` |
| Unit Testing | Vitest + Testing Library | `^4.1.7` / `^16.3.2` |
| E2E Testing | Playwright | `^1.60.0` |
| Bundle Analysis | @next/bundle-analyzer | `^16.2.7` |

## Prerequisites

- **Node.js 22+**
- **npm**
- **Docker & Docker Compose** (for containerized development/production)

## Setup Instructions

### Environment Setup

Create a `.env` file in the root directory and copy the contents from `.env.example`:

```sh
cp .env.example .env
```

### Local Development (Bare-Metal)

```sh
npm install
npm run dev
```

The development server starts at [http://localhost:3000](http://localhost:3000).

### Docker Compose (Development)

The development environment mounts the source as a volume for live-reloading and routes API calls to the backend via `host.docker.internal`:

```sh
make dev-up
```

To stop the environment:

```sh
make dev-down
```

### Docker Compose (Production)

Pulls the latest pre-built image from Docker Hub and runs the optimized standalone Next.js server as a non-root user:

```sh
make prod-up
```

## Project Structure

```
├── apis/                   # Axios-based API modules (auth, cart, order, product, …)
│   └── __tests__/          # API layer unit tests
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Auth route group — signin, signup, forgot/reset-password
│   ├── (backoffice)/       # Admin dashboard route group
│   ├── product/            # Product listing & detail ([productId] dynamic route)
│   ├── cart/               # Shopping cart
│   ├── order/              # Order history
│   ├── purchase/           # Purchase flow
│   ├── payment/            # Stripe payment success/failure pages
│   ├── profile/            # User profile
│   ├── apparel/            # Apparel category page
│   └── accessory/          # Accessory category page
├── components/             # Reusable UI components by feature domain
│   ├── auth/               # Auth forms, footer
│   ├── backoffice/         # Admin sidebar, topbar, search
│   ├── cart/               # Cart table/cards
│   ├── home/               # Homepage sections
│   ├── navigation/         # TopNav, sidebar, menu dropdown
│   ├── order/              # Order display components
│   ├── products/           # Product cards, grids
│   ├── profile/            # Profile editing
│   ├── purchase/           # Purchase flow UI
│   ├── skeleton/           # Loading skeleton components
│   └── slide/              # Embla Carousel slides
├── shared/                 # Cross-cutting concerns
│   ├── colors.ts           # Theme color constants (gold & dark)
│   ├── routeList.ts        # Public & full-width route definitions
│   ├── constants/          # API base URLs, error messages
│   ├── enums/              # Category, order, orderBy enums
│   ├── fonts/              # Font definitions (Geist Sans/Mono)
│   ├── hooks/              # useAuthContext, useMediaQuery, useWebSocketContext
│   ├── interfaces/         # TypeScript interfaces (cart, product, user)
│   ├── types/              # TypeScript types (auth, cart, order, payment, …)
│   └── utils/              # Cookies, JWT decryption, error sanitizer, number formatting
├── e2e/                    # Playwright end-to-end tests
├── proxy.ts                # Next.js middleware — JWT verification & role-based routing
├── next.config.ts          # Next.js config — standalone output, S3 image patterns, security headers
├── vitest.config.ts        # Vitest unit test configuration
├── playwright.config.ts    # Playwright E2E configuration
├── Dockerfile              # Multi-stage Docker build (dev → builder → production runner)
├── docker-compose.dev.yml  # Development compose with volume mounts & hot-reload
├── docker-compose.prod.yml # Production compose with pre-built image
└── Makefile                # Developer task runner
```

## Environment Variables Reference

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BACKEND_SERVER_ADDRESS` | Backend API base URL (public, baked into client bundle) |
| `BACKEND_INTERNAL_ADDRESS` | Backend URL for server-side calls inside Docker (e.g., `http://host.docker.internal:5000`) |
| `JWT_SECRET` | Shared secret for server-side JWT verification via `jose` |


## Available Make Targets

| Target | Description |
|--------|-------------|
| `dev-up` / `dev-down` / `dev-restart` | Manage development Docker environment |
| `dev-logs` / `dev-clean` | View logs / tear down with images & volumes |
| `prod-up` / `prod-down` / `prod-restart` | Manage production Docker environment |
| `prod-logs` / `prod-clean` | View logs / tear down with images & volumes |
| `build` | Run `npm run build` |
| `test-unit` | Run Vitest unit tests |
| `test-e2e` / `test-e2e-ui` | Run Playwright E2E tests (headless / interactive UI) |
| `typecheck` | Run `tsc --noEmit` |
| `lint` | Run ESLint |
| `validate` | Run lint → typecheck → unit tests → E2E tests |
| `pre-commit` | Full pre-commit gate (lint, typecheck, build, E2E against prod image) |
| `setup-hooks` | Install Husky git hooks |

## Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Webpack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run test:ui` | Vitest interactive UI |
| `npm run analyze` | Bundle analysis (generates report) |

## CI/CD

- **CI Pipeline** (`.github/workflows/ci.yml`) — triggers on push/PR to `main`. Runs lint, typecheck, unit tests, production build, and validates the Docker image.
- **CD Pipeline** (`.github/workflows/cd.yml`) — triggers after a successful CI run on `main`. Builds and pushes the production Docker image to Docker Hub.
