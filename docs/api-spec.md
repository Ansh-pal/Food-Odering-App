# API Specification

Base URL: `http://localhost:5000/api/v1`

## Auth
| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | /auth/login | Public | Login with seeded credentials and receive JWT |
| GET | /auth/me | Authenticated | Return the current token user profile |

## Restaurants
| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | /restaurants?includeMenu=true | Admin, Manager, Member | List visible restaurants; managers/members only see own country |
| GET | /restaurants/:id/menu | Admin, Manager, Member | View restaurant menu with scope enforcement |

## Orders
| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | /orders | Admin, Manager, Member | Create a draft order for a restaurant |
| POST | /orders/:id/items | Admin, Manager, Member | Add an item to a draft order |
| GET | /orders | Admin, Manager, Member | List orders; managers/members limited to own country |
| GET | /orders/:id | Admin, Manager, Member | View one order with country restrictions |
| POST | /orders/:id/checkout | Admin, Manager | Place a draft order and charge the existing payment method |
| POST | /orders/:id/cancel | Admin, Manager | Cancel a placed order |

## Users
| Method | Path | Access | Purpose |
|---|---|---|---|
| PATCH | /users/:id/payment-method | Admin | Update the payment method for a user |

## Error Codes
| Code | Meaning |
|---|---|
| 400 | Validation error or bad request |
| 401 | Missing/invalid authentication |
| 403 | Role or country access denied |
| 404 | Resource not found |
| 409 | Invalid order status transition |

## Example Request Flow
1. Login as a seeded user.
2. Save JWT.
3. Fetch restaurants visible to the user.
4. Create a draft order.
5. Add menu items.
6. Checkout or cancel when allowed by role.
