.PHONY: up build down logs seed restart

up:
	docker compose up -d

build:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f web

seed:
	docker compose exec web npx prisma db seed

restart:
	docker compose restart
