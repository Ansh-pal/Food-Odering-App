# Phase 1: Architecture and Implementation Plan

## 1. Objective
Build a full stack food ordering web application with role-based access control (RBAC) and country-scoped relational access.

Roles:
- Admin
- Manager
- Member

Seeded users:
- Nick Fury: Admin (global)
- Captain Marvel: Manager (India)
- Captain America: Manager (America)
- Thanos: Member (India)
- Thor: Member (India)
- Travis: Member (America)

## 2. Functional Requirements Mapping
1. View restaurants and menu items
- Allowed: Admin, Manager, Member

2. Create order and add food items
- Allowed: Admin, Manager, Member

3. Place order (checkout and pay)
- Allowed: Admin, Manager
- Denied: Member

4. Cancel order
- Allowed: Admin, Manager
- Denied: Member

5. Update payment method
- Allowed: Admin
- Denied: Manager, Member

Bonus: Country scoping
- Admin can access all countries.
- Manager and Member can only view and act on records tied to their own country.

## 3. Proposed Tech Stack
Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

Frontend:
- React (existing CRA project)
- Fetch API (or axios) for API calls

Developer tooling:
- Nodemon for backend dev
- Postman collection for API verification

## 4. High-Level Architecture
Client (React)
- Login as seeded user
- Reads token and profile
- Renders role-aware UI
- Calls backend APIs with Bearer token

Server (Express)
- Auth route issues JWT
- Middleware chain:
  - authenticateToken
  - authorizeRoles
  - enforceCountryScope
- Resource routes for restaurants, menu, orders, payment method

Database (MongoDB)
- Users, Restaurants, MenuItems, Orders collections

## 5. Data Model
### User
Fields:
- name: String
- username: String (unique)
- password: String (plain text acceptable for this assignment only)
- role: Enum [admin, manager, member]
- country: Enum [India, America]
- paymentMethod: Object
  - type: String (card, upi, wallet)
  - last4: String
  - provider: String

Indexes:
- username unique
- role + country for efficient role/country filtering

### Restaurant
Fields:
- name: String
- country: Enum [India, America]
- cuisine: String
- isActive: Boolean

Indexes:
- country

### MenuItem
Fields:
- restaurantId: ObjectId -> Restaurant
- name: String
- description: String
- price: Number
- isAvailable: Boolean

Indexes:
- restaurantId

### Order
Fields:
- createdBy: ObjectId -> User
- country: Enum [India, America]
- restaurantId: ObjectId -> Restaurant
- items: Array
  - menuItemId: ObjectId -> MenuItem
  - name: String
  - quantity: Number
  - unitPrice: Number
  - lineTotal: Number
- totalAmount: Number
- status: Enum [draft, placed, cancelled]
- paymentSnapshot: Object (captured at checkout)
- timestamps: createdAt, updatedAt

Indexes:
- createdBy
- country
- status

## 6. RBAC Matrix
| Function | Admin | Manager | Member |
|---|---|---|---|
| View restaurants and menu | Yes | Yes | Yes |
| Create order / add items | Yes | Yes | Yes |
| Place order (checkout and pay) | Yes | Yes | No |
| Cancel order | Yes | Yes | No |
| Update payment method | Yes | No | No |

## 7. Country-Scoped Access Rules (Bonus)
1. Admin
- No country restriction.
- Can view and manage all restaurants, orders, and users.

2. Manager and Member
- Can only read restaurants where restaurant.country equals user.country.
- Can only create orders with restaurant.country equal to user.country.
- Can only read orders where order.country equals user.country.
- Cannot perform actions on entities outside their country.

3. Validation strategy
- Route-level role checks first.
- Resource-level country checks second.
- Ownership checks for order mutation where needed.

## 8. API Design (v1)
Auth:
- POST /api/v1/auth/login

Restaurants:
- GET /api/v1/restaurants
- GET /api/v1/restaurants/:id/menu

Orders:
- POST /api/v1/orders
- POST /api/v1/orders/:id/items
- POST /api/v1/orders/:id/checkout
- POST /api/v1/orders/:id/cancel
- GET /api/v1/orders
- GET /api/v1/orders/:id

Users:
- PATCH /api/v1/users/:id/payment-method

## 9. Endpoint Access and Scope
POST /auth/login
- Public

GET /restaurants, GET /restaurants/:id/menu
- Roles: admin, manager, member
- Country scope for manager/member

POST /orders, POST /orders/:id/items
- Roles: admin, manager, member
- Country scope for manager/member

POST /orders/:id/checkout
- Roles: admin, manager
- Country scope for manager
- Requires order status draft

POST /orders/:id/cancel
- Roles: admin, manager
- Country scope for manager
- Requires order status placed or draft (policy choice)

PATCH /users/:id/payment-method
- Roles: admin only

GET /orders, GET /orders/:id
- Admin: all orders
- Manager/member: same-country orders only

## 10. Security and Validation
- JWT signed with server secret
- Token includes userId, role, country
- Input validation on all write endpoints
- Prevent status transition misuse:
  - Only draft -> placed
  - placed -> cancelled (or draft -> cancelled if business allows)
- Return standard 401/403/404/422 responses

## 11. Frontend Information Architecture
Views/components:
- Login panel (select seeded user)
- Restaurants list with menu items
- Cart / Draft order editor
- Orders table
- Role-aware action controls:
  - Checkout hidden/disabled for member
  - Cancel hidden/disabled for member
  - Payment method panel visible only for admin

State:
- auth: token, user
- restaurants and menu
- active draft order
- orders list
- ui loading/error flags

## 12. Folder Structure Plan
Root:
- backend/
- frontend/
- docs/
  - phase-1-architecture-and-plan.md
  - architecture-overview.md (phase 9)
  - api-spec.md (phase 9)

Backend (planned):
- src/
  - app.js
  - server.js
  - config/
    - env.js
    - db.js
  - middleware/
    - authenticateToken.js
    - authorizeRoles.js
    - enforceCountryScope.js
    - errorHandler.js
  - models/
    - User.js
    - Restaurant.js
    - MenuItem.js
    - Order.js
  - controllers/
    - authController.js
    - restaurantController.js
    - orderController.js
    - userController.js
  - routes/
    - authRoutes.js
    - restaurantRoutes.js
    - orderRoutes.js
    - userRoutes.js
  - data/
    - seed.js
  - utils/
    - ApiError.js

Frontend (planned):
- src/
  - api/
    - client.js
  - components/
    - LoginPanel.jsx
    - HeaderBar.jsx
    - RestaurantList.jsx
    - MenuList.jsx
    - CartPanel.jsx
    - OrdersTable.jsx
    - PaymentMethodPanel.jsx
  - hooks/
    - useAuth.js
  - App.js
  - App.css

## 13. Test Strategy (Functional + Authorization)
1. Functional tests
- Login as each seeded user
- Create draft order
- Add items and verify totals
- Checkout and verify status changes to placed
- Cancel and verify status changes to cancelled

2. RBAC tests
- Member checkout should fail 403
- Member cancel should fail 403
- Manager payment update should fail 403

3. Country scope tests
- India manager cannot read America restaurants/orders
- America member cannot modify India order
- Admin can access both India and America

## 14. Implementation Checklist
Phase 2:
- Scaffold backend server, config, middleware skeleton

Phase 3:
- Create models and seed data script

Phase 4:
- Implement auth and RBAC middleware

Phase 5:
- Implement protected feature APIs and validations

Phase 6:
- Build API collection with positive and negative test cases

Phase 7:
- Implement frontend auth shell

Phase 8:
- Implement feature screens and role-aware UI

Phase 9:
- Write README and architecture/API docs

Phase 10:
- Run final QA checklist and demo script

## 15. Acceptance Criteria for Phase 1
- Requirements are mapped to architecture.
- RBAC matrix is explicit and complete.
- Country-scoped policy is defined and enforceable.
- API surface and data models are finalized.
- Next phase tasks are unambiguous.
