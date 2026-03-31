.PHONY: dev frontend backend install

dev:
	make -j2 frontend backend

frontend:
	cd frontend && npm run dev

backend:
	cd backend && .venv/bin/uvicorn main:app --reload --port 8000

install:
	cd frontend && npm install
	cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
