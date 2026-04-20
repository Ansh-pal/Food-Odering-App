# Food Ordering App

A full-stack food ordering take-home project with role-based access control (RBAC) and country-scoped access for managers and members.

## Stack
- Frontend: React (Create React App)
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT

## Features
- Seeded login for Admin, Managers, and Members
- Restaurant and menu browsing
- Draft order creation and item management
- Checkout and cancel order flows
- Admin-only payment method updates
- Country-scoped access for India and America users

## Project Structure
- [backend](backend) - Express API, Mongoose models, auth, and business rules
- [frontend](frontend) - React UI for login, ordering, and account actions
- [docs](docs) - architecture, API collection, and reference docs

## 🚀 Deployment
Want to make your app live for everyone? See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions to deploy on:
- **Frontend** on Vercel (free)
- **Backend** on Railway (free tier)
- **Database** on MongoDB Atlas (free tier)

Takes about 12 minutes and costs $0/month! 

## Local Setup
### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB connection string

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Backend default URL:
- `http://localhost:5000/api/v1`

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

Frontend default URL:
- `http://localhost:3000`

## Environment Variables
### Backend `.env`
- `NODE_ENV=development`
- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/food_ordering_app`
- `JWT_SECRET=replace_with_strong_secret`
- `JWT_EXPIRES_IN=1d`
- `CORS_ORIGIN=http://localhost:3000`

### Frontend `.env` optional
- `REACT_APP_API_BASE_URL=http://localhost:5000/api/v1`

## Seeded Users
- Nick Fury - Admin - America
- Captain Marvel - Manager - India
- Captain America - Manager - America
- Thanos - Member - India
- Thor - Member - India
- Travis - Member - America

## Verification Artifacts
- API collection: [docs/api-collection](docs/api-collection)
- Architecture: [docs/architecture-overview.md](docs/architecture-overview.md)
- API spec: [docs/api-spec.md](docs/api-spec.md)
- Seed summary: [docs/seed-data-summary.md](docs/seed-data-summary.md)
- Final quality pass: [docs/final-quality-pass.md](docs/final-quality-pass.md)

## Notes
- Use the Postman collection to validate RBAC and country-scoped access.
- Re-run `npm run seed` in backend before demoing to reset the sample dataset.
