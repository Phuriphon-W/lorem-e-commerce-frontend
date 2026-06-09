.PHONY: test-e2e test-e2e-ui test-unit typecheck lint validate pre-commit setup-hooks

build:
	npm run build

dev-up:
	docker compose -f docker-compose.dev.yml up -d

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-restart: dev-down dev-up

dev-logs:
	docker logs -f $(shell docker ps -q -f "name=lorem-frontend")

dev-clean:
	docker compose -f docker-compose.dev.yml down --rmi all -v --remove-orphans

prod-up:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-restart: prod-down prod-up

prod-logs:
	docker logs -f $(shell docker ps -q -f "name=lorem-frontend")

prod-clean:
	docker compose -f docker-compose.prod.yml down --rmi all -v --remove-orphans

# E2E Tests (Playwright)
test-e2e:
	npx playwright test

test-e2e-ui:
	npx playwright test --ui

# Unit Tests (Vitest)
test-unit:
	npm run test:run

# Static Analysis
typecheck:
	npx tsc --noEmit

lint:
	npm run lint

# Comprehensive Validation (Run this before opening a PR)
validate: lint typecheck test-unit test-e2e
	@echo "✅ All code validation and tests passed!"

# Pre-commit Hook Target (Usually omits E2E to keep commits fast, but added here for completeness)
pre-commit: lint typecheck build test-unit test-e2e
	@echo "✅ Pre-commit checks passed!"

# Setup Git Hooks (using husky)
setup-hooks:
	npm install -D husky lint-staged
	npx husky init
	echo "make pre-commit" > .husky/pre-commit
	@echo "✅ Git hooks configured!"
