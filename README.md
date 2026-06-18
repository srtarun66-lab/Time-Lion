# ⌚ Right Time Right Now — Niraz Watch Store v2.0

A **fully functional e-commerce website** for watches, built with:
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)

---

## 📁 Project Structure

```
niraz-watch-store/
├── backend/
│   ├── server.js                   ← Main server entry point
│   ├── models/
│   │   ├── Order.js                ← Order schema (multi-item, status tracking)
│   │   └── Product.js              ← Product schema (category, stock, rating)
│   ├── controllers/
│   │   ├── orderController.js      ← Place, fetch, update orders
│   │   └── productController.js    ← CRUD for products
│   └── routes/
│       ├── orders.js               ← /api/orders
│       ├── products.js             ← /api/products
│       └── admin.js                ← /api/admin
├── frontend/
│   ├── index.html                  ← Homepage (Right Time Right Now hero)
│   ├── css/style.css               ← Full premium dark theme
│   ├── js/app.js                   ← Cart, orders, toast, product rendering
│   └── pages/
│       ├── classic-metal.html      ← 8 Classic Metal products
│       ├── digital-mania.html      ← 8 Digital Mania products
│       ├── special-combo.html      ← 2 Special Combo bundles
│       └── orders.html             ← Order tracking by phone
└── admin-panel/
    └── dashboard.html              ← Full admin panel (stats, orders, products)
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
mongod
```
> Make sure MongoDB is running on `localhost:27017`

### 3. Start the server
```bash
npm start
# or for auto-reload:
npm run dev
```

Server runs on: **http://localhost:5000**

### 4. Open the store
Open `frontend/index.html` in your browser, or visit:
```
http://localhost:5000
```

---

## 🌱 Auto Database Seeding

On first run, the server **automatically seeds the database** with:
- **8 Classic Metal** products (Imperial Steel, Bronze Legend, Silver Crown, Titan Noir, Gold Prestige, Steel Phantom, Heritage Rose, Marine Pro)
- **8 Digital Mania** products (NeonPulse X1, CyberTime 3000, Matrix Sport, Glitch Ultra, Pixel Storm, Volt Runner, Data Knight, Flash Zero)
- **2 Special Combo** bundles (Steel + Digital Bundle, Ultimate Titan Combo)

---

## 🔗 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All active products |
| GET | `/api/products?category=classic-metal` | Filter by category |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Add product (admin) |
| PATCH | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Soft delete (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/:phone` | Customer orders by phone |
| GET | `/api/orders/all` | All orders (admin) |
| GET | `/api/orders/stats` | Order statistics (admin) |
| PATCH | `/api/orders/:id/status` | Update order status (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/health` | Server health check |

---

## 🛒 Features

- ✅ Shopping cart with quantity control (localStorage)
- ✅ Full checkout form (name, phone, email, address, city, pincode)
- ✅ COD & Online payment mode selection
- ✅ Auto-generated Order IDs (e.g. NRZ-XXXXX)
- ✅ Order tracking by phone number
- ✅ Toast notifications
- ✅ Admin dashboard with live stats
- ✅ Admin can update order statuses
- ✅ Admin can add/remove products
- ✅ Mobile responsive navbar
- ✅ Product ratings, badges, discount percentages
- ✅ Auto-seed database on first run

---

## 📦 Dependencies

```json
{
  "express": "^4.19.2",
  "mongoose": "^8.5.1",
  "cors": "^2.8.5"
}
```

---

*© 2025 Niraz Watch Store – Right Time Right Now*
