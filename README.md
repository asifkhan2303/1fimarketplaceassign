# 1Fi Marketplace

A MERN implementation of the **1Fi Marketplace** section on the Shop page, built for the SDE Intern assignment. The Shop page keeps its existing three-tab layout — **Top Brands** and **Nearby Stores** are left as placeholders (out of scope per the brief), and **1Fi Marketplace** is fully implemented end-to-end: product listing → product detail → variant selection → EMI plan selection → proceed CTA.

## Stack

- **Frontend:** React 18 + Vite, React Router, plain CSS (no UI kit, to keep bundle/style fully under our control and match the existing app's look)
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

## Why it's structured this way

- **No hardcoded product/EMI data in the UI.** Everything the Marketplace shows comes from `GET /api/products*` endpoints backed by MongoDB. Only mock *seed* data is hardcoded, and only inside `backend/seed/seedData.js`, clearly separated from application code.
- **EMI math lives in one place** (`backend/utils/emi.js`) and runs entirely server-side, both for computing plans to display (`GET /api/products/:id/emi-plans`) and for re-validating the price when an order is created (`POST /api/orders`). The frontend never invents a price — it always asks the server.
- **Variant pricing uses deltas, not absolute prices**, so the base `price` field is always the single source of truth and variant combinations can't drift out of sync with it.
- **Loading / error / empty states are explicit** on every data-fetching screen (`StatusStates.jsx`), rather than silently rendering nothing while a request is in flight or failed.

## Project layout

```
1fi-marketplace/
├── backend/
│   ├── config/db.js              # Mongo connection
│   ├── models/                   # Product, Order schemas
│   ├── controllers/              # Request handlers
│   ├── routes/                   # Express routers
│   ├── utils/emi.js              # EMI calculation (single source of truth)
│   ├── seed/seedData.js          # Mock catalogue (8 products)
│   └── server.js                 # App entry point
└── frontend/
    └── src/
        ├── api/marketplaceApi.js # fetch wrapper, one function per endpoint
        ├── components/           # Reusable UI: ProductCard, EmiPlanSelector,
        │                         # VariantSelector, ShopTabs, SearchBar,
        │                         # CategoryChips, BottomNav, StatusStates
        ├── pages/                # ShopPage, MarketplaceHome,
        │                         # ProductDetailPage, OrderConfirmationPage
        └── styles/global.css     # Design tokens matched to the existing app
```

## Running it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env       # edit MONGO_URI if not using local MongoDB
npm run seed                # populates the product catalogue
npm run dev                 # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts Vite on http://localhost:5173
```

No `.env` is required for local dev — the Vite dev server proxies `/api/*` to `http://localhost:5000` (see `vite.config.js`), so the frontend never needs a hardcoded backend URL.

If you deploy the frontend and backend separately (different origins), copy `.env.example` to `.env` and set:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

pointing at wherever the backend actually runs.

Open `http://localhost:5173/shop` — the Shop page loads on the "Top Brands" tab; tap **1Fi Marketplace** to browse products.

## API reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | List products; supports `?category=`, `?search=`, `?brand=` |
| GET | `/api/products/categories` | Distinct category list, for the filter chips |
| GET | `/api/products/:id` | Full product detail |
| GET | `/api/products/:id/emi-plans?variants=Storage:128GB,Color:Black` | EMI plans priced against selected variants |
| POST | `/api/orders` | Create an order for a selected product + variant + tenure |
| GET | `/api/orders/:id` | Fetch an order (used by the confirmation screen) |

## What's mocked vs. real

- **Real:** the full data flow — MongoDB → Express → REST API → React UI — for every screen in the Marketplace flow.
- **Mocked:** the underlying mutual-fund-backed underwriting/loan approval that a real "Proceed with this plan" tap would kick off. `POST /api/orders` records the selected plan as a lightweight `Order` document; wiring it to 1Fi's actual lending backend is out of scope for this assignment.

## Notable UX choices

- The hero banner and pill-shaped tab switcher mirror the reference screenshot (gradient purple hero, rounded search bar, card-based lists, bottom nav) so the new section doesn't feel bolted on.
- EMI plans are framed as "no interest, no credit score check — backed by your mutual fund holdings," consistent with the marketing copy on 1Fi's existing Shop banner.
- Variant selection defaults to the first option per group on page load, so an EMI plan is visible immediately rather than waiting for the user to make every choice first.
