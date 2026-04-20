# Seed Data Summary

Run the backend seed script with:
```bash
cd backend
npm run seed
```

## Seeded Users
| Name | Username | Role | Country | Payment Method |
|---|---|---|---|---|
| Nick Fury | nick.fury | admin | America | Mastercard card ending 1111 |
| Captain Marvel | captain.marvel | manager | India | UPI via GPay ending 2222 |
| Captain America | captain.america | manager | America | Visa card ending 3333 |
| Thanos | thanos | member | India | Wallet via Paytm ending 4444 |
| Thor | thor | member | India | UPI via PhonePe ending 5555 |
| Travis | travis | member | America | Amex card ending 6666 |

## Seeded Restaurants
| Restaurant | Country | Cuisine |
|---|---|---|
| Spice Route | India | North Indian |
| Mumbai Bites | India | Street Food |
| Liberty Grill | America | American |
| Brooklyn Pizza | America | Italian-American |

## Menu Item Count
- 4 items per restaurant
- 16 total menu items

## Reset Behavior
The seed script clears users, restaurants, menu items, and orders before inserting the sample dataset so demo runs stay deterministic.

## Notes
- The seed data is designed to show both India and America access boundaries.
- All password values are `Pass@123` for the assignment demo environment.
