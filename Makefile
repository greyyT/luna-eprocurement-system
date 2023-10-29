up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

rebuild:
	docker compose build --no-cache

restart:
	docker compose restart

logs:
	docker compose logs -f