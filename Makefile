dev-up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

dev-down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

test-up:
	docker compose -f docker-compose.yml -f docker-compose.test.yml up -d

test-down:
	docker compose -f docker-compose.yml -f docker-compose.test.yml down

prod-up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

.PHONY: dev-up dev-down test-up test-down prod-up prod-down