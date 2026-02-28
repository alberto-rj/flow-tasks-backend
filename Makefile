CONTAINER_API=app-api
CONTAINER_DB=app-db

dev-up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

dev-down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

test-up:
	docker compose -f docker-compose.yml -f docker-compose.test.yml up -d --build

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

.PHONY: dev-up dev-down test-up test-down prod-up prod-down api-shell db-shell
