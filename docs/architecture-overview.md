# Architecture Overview

## System Overview
The application uses a React frontend and an Express/Mongoose backend connected to MongoDB.

### Request Flow
1. A user signs in with one of the seeded accounts.
2. The backend returns a signed JWT and a user profile payload.
3. The frontend stores the session in localStorage and local state.
4. Protected API calls include the Bearer token.
5. Backend middleware authenticates the token, checks the role, and enforces country scope.
6. Controllers query MongoDB and return role-aware data.

## Backend Layers
- `routes`: request entry points grouped by domain
- `controllers`: business logic for auth, restaurants, orders, and users
- `middleware`: JWT auth, RBAC, country scope, and error handling
- `models`: MongoDB collections for users, restaurants, menu items, and orders
- `config`: environment and database connection setup

## Frontend Layers
- `api/client.js`: typed fetch wrapper for the API
- `hooks/useAuth.js`: persistent auth session manager
- Components:
  - login panel
  - header bar
  - restaurant list
  - menu list
  - cart panel
  - orders table
  - payment method panel
  - access summary panel

## Data Model Summary
### User
Stores identity, role, country, and payment method.

### Restaurant
Stores restaurant name, cuisine, and country.

### MenuItem
References a restaurant and stores menu metadata.

### Order
References user, restaurant, and item snapshots; tracks status and payment snapshot.

## RBAC Design
- Admin: full access across countries
- Manager: all allowed actions except payment method updates, restricted to own country
- Member: browse, create orders, and add items, restricted to own country

## Country Scope Rules
- Admin sees all countries
- Manager and member only see restaurants and orders from their assigned country
- Cross-country order access returns 403

## Status Flow
- Draft order is created first
- Menu items are added to the draft
- Manager/Admin can checkout draft orders
- Manager/Admin can cancel placed orders
- Admin can update payment method

## Validation and Error Handling
- 401 for missing or invalid JWT
- 403 for role or country violations
- 404 for missing resources
- 409 for invalid status transitions
- 400 for malformed request data
