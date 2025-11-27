# RPG Diary App

A calendar and diary application for tabletop RPG campaigns with support for multiple calendar systems (Pyarr and Kyr).

## Features

- Multiple calendar systems (Pyarr, Kyr)
- Participant and party management
- Notable dates and holidays
- Calendar-based event tracking

## Tech Stack

- **Backend:** Spring Boot, PostgreSQL, Maven
- **Frontend:** React, TypeScript, Vite
- **Infrastructure:** Docker, Docker Compose

## Quick Start

### Prerequisites

- Docker
- Docker Compose

### Running the Application

```bash
# Clone the repository
git clone <repo>
cd rpg-diary-app

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:5432
