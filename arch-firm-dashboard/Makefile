# Build and Deployment Scripts

# Install dependencies for both projects
install:
	cd desktop-app && npm install
	cd admin-dashboard && npm install

# Development - run both projects
dev:
	@echo "Starting development servers..."
	cd admin-dashboard && npm run dev &
	cd desktop-app && npm run dev

# Build desktop app for production
build-desktop:
	cd desktop-app && npm run build

# Build admin dashboard for production  
build-admin:
	cd admin-dashboard && npm run build

# Build both projects
build-all: build-desktop build-admin

# Create desktop app installers
dist-desktop:
	cd desktop-app && npm run dist

# Start production server
start-server:
	cd admin-dashboard && npm start

# Run tests
test:
	cd desktop-app && npm test
	cd admin-dashboard && npm test

# Clean build artifacts
clean:
	rm -rf desktop-app/dist desktop-app/dist-electron
	rm -rf admin-dashboard/dist
	rm -rf admin-dashboard/data/*.db

# Docker build (optional)
docker-build:
	docker build -t archtrack-admin ./admin-dashboard

docker-run:
	docker run -p 3000:3000 archtrack-admin

# Database backup
backup-db:
	mkdir -p backups
	cp admin-dashboard/data/archtrack.db backups/archtrack-$(shell date +%Y%m%d-%H%M%S).db

# Reset database (WARNING: deletes all data!)
reset-db:
	rm -f admin-dashboard/data/archtrack.db
	@echo "Database reset. Restart server to recreate."

# Help
help:
	@echo "Available targets:"
	@echo "  install        - Install dependencies for all projects"
	@echo "  dev            - Run development servers"
	@echo "  build-desktop  - Build desktop app"
	@echo "  build-admin    - Build admin dashboard"
	@echo "  build-all      - Build all projects"
	@echo "  dist-desktop   - Create desktop installers"
	@echo "  start-server   - Start production server"
	@echo "  test           - Run tests"
	@echo "  clean          - Clean build artifacts"
	@echo "  backup-db      - Backup database"
	@echo "  reset-db       - Reset database (WARNING: destructive)"
