# Recipe Sharing Platform - Backend

## Overview
A backend service for a recipe sharing platform that enables users to discover, share, and manage recipes.

## Features
- User authentication and authorization
- Recipe CRUD operations
- Recipe search and filtering
- User profiles and ratings
- Comment and review system

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

## Environment Variables
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create recipe
- `GET /api/recipes/:id` - Get recipe by ID
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

## Contributing
Pull requests are welcome. Please follow the existing code style.

## License
MIT