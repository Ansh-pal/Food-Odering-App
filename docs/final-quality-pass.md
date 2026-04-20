# Final Quality Pass

## Bug Checklist
Use this list before submission:
- [ ] Backend starts successfully with `npm run dev`
- [ ] Frontend builds successfully with `npm run build`
- [ ] MongoDB connection string is valid in backend `.env`
- [ ] Seed script runs without errors and resets data correctly
- [ ] Login returns a JWT for each seeded user
- [ ] `GET /auth/me` returns the current user profile
- [ ] Restaurants are filtered by country for manager/member users
- [ ] Draft orders can be created for visible restaurants only
- [ ] Menu items can be added to a draft order
- [ ] Member checkout is blocked with 403
- [ ] Member cancel is blocked with 403
- [ ] Manager payment method update is blocked with 403
- [ ] Admin payment method update succeeds
- [ ] Country-crossing order access returns 403
- [ ] Cancel only works on allowed order states
- [ ] Checkout only works on draft orders with items

## Security Checklist
- [ ] JWT secret is not committed in `.env`
- [ ] Backend `.env` is excluded from git
- [ ] Authenticated routes reject missing or invalid tokens
- [ ] RBAC is enforced in backend routes, not only in frontend UI
- [ ] Country-scoped access is validated on the server
- [ ] Input validation exists for login, order creation, and payment updates
- [ ] Order status transitions are constrained
- [ ] Payment method updates are admin-only
- [ ] No sensitive values are printed in logs
- [ ] API collection uses environment variables instead of hardcoded secrets

## Manual Test Checklist
### Authentication
- [ ] Login as Nick Fury returns admin profile and token
- [ ] Login as Captain Marvel returns manager India profile and token
- [ ] Login as Captain America returns manager America profile and token
- [ ] Login as Thanos returns member India profile and token
- [ ] Login as Thor returns member India profile and token
- [ ] Login as Travis returns member America profile and token

### Restaurant Access
- [ ] India manager sees only India restaurants
- [ ] America manager sees only America restaurants
- [ ] India member sees only India restaurants
- [ ] America member sees only America restaurants
- [ ] Admin sees all restaurants

### Order Flow
- [ ] Create draft order works for any visible restaurant
- [ ] Add menu items to draft order works
- [ ] Checkout works for admin and manager
- [ ] Cancel works for admin and manager
- [ ] Checkout fails for member
- [ ] Cancel fails for member

### Payment Method
- [ ] Admin can update payment method
- [ ] Manager cannot update payment method
- [ ] Member cannot update payment method

### Country Scope
- [ ] India user cannot access America order data
- [ ] America user cannot access India order data
- [ ] Admin can access both countries

## Demo Video Script
Target length: 3 to 5 minutes.

### 1. Intro
- Show the app running locally.
- State the stack: React, Express, MongoDB, JWT.
- Mention seeded users and RBAC.

### 2. Admin Demo
- Login as Nick Fury.
- Show all restaurants.
- Create an order, add items, and checkout.
- Open payment method panel and update it.
- Explain that admin has full access.

### 3. Manager Demo
- Login as Captain Marvel or Captain America.
- Show that only their country’s restaurants are visible.
- Create an order and add items.
- Checkout and cancel the order.
- Attempt payment update to demonstrate 403.

### 4. Member Demo
- Login as Thanos or Travis.
- Show country-scoped restaurant access.
- Create a draft order and add items.
- Attempt checkout and cancel to demonstrate 403.

### 5. Close
- Mention API collection, docs, and seed script.
- Summarize RBAC and country-scope implementation.

## Final Submission Checklist
- [ ] Backend code committed
- [ ] Frontend code committed
- [ ] README present with local setup
- [ ] Architecture doc present
- [ ] API spec present
- [ ] Seed data summary present
- [ ] Postman collection exported
- [ ] Demo script prepared
- [ ] Demo video recorded or deployment link available
- [ ] Final repository link ready to share

## Recommended Submission Order
1. README
2. Architecture overview
3. API spec
4. Seed data summary
5. Postman collection and environment
6. Demo video or deployment link
7. Repository link
