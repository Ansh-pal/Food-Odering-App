# Phase 6 API Collection

## Files
- Food-Ordering-App.postman_collection.json
- Food-Ordering-Local.postman_environment.json

## Import Steps
1. Open Postman.
2. Import both files from this folder.
3. Select the environment "Food Ordering Local".
4. Ensure backend is running at `http://localhost:5000`.
5. Run requests in this order:
   - 01 Auth folder
   - 02 Restaurants folder
   - 03 Order Lifecycle folder
   - 04 Payment Method folder

## Coverage
- Positive auth for all seeded users
- Restaurants listing with country-scoped assertions
- Member order creation and add-item success
- RBAC denial: member checkout
- Country denial: America manager reads India order
- Manager checkout and cancel positive flow
- RBAC denial: manager payment update
- Admin payment update success

## Notes
- Request test scripts auto-save tokens and IDs into environment variables.
- Re-run seed before test runs for deterministic data:
  - `cd backend`
  - `npm run seed`
