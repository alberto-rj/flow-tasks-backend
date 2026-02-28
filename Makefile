CONTAINER_API=app-api
CONTAINER_DB=app-db
DB_USER=alberto
DB_NAME=postgres

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

api-shell:
	docker exec -it $(CONTAINER_API) sh

db-shell:
	docker exec -it $(CONTAINER_DB) sh

db-login:
	docker exec -it $(CONTAINER_DB) psql -U $(DB_USER) -d $(DB_NAME)

.PHONY: dev-up dev-down test-up test-down prod-up prod-down