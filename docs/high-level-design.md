# High-Level Design Document: Order Management System (Igniflo)

## ⚙️ Architecture Overview
- **Frontend**: React.js with Axios and Context API
- **Backend**: Express.js REST API
- **Database**: MongoDB with Mongoose
- **Real-Time**: Socket.io for status updates
- **Deployment**: Netlify (frontend) + Railway (backend)

## 🔄 Request-Response Flow
User → React → Axios → Express API → MongoDB → Response to React

## 📡 Real-Time Flow
Order status update → emit via Socket.io → client UI reflects changes live

## 🧩 Components
- **Frontend**: `CustomerDashboard`, `AdminDashboard`, `OrderForm`, `StatusTracker`
- **Backend**: Routes → Controllers → Services (business logic) → Models

## 🗃️ Database Schema (ERD-style)
- `User`: name, email, password, role
- `Product`: name, stock, price
- `Order`: userId, items[], status, paymentReceived
- `OrderItem`: productId, quantity (embedded inside Order)

## 🔗 API Contract

| Endpoint               | Method | Role     | Description                    |
|------------------------|--------|----------|--------------------------------|
| /api/users/register    | POST   | Public   | Register user                  |
| /api/users/login       | POST   | Public   | Login                          |
| /api/products/         | GET    | All      | List all products              |
| /api/products/         | POST   | Admin    | Create new product             |
| /api/orders/           | POST   | Customer | Place an order                 |
| /api/orders/:id        | GET    | Customer | View own order by ID           |
| /api/orders/admin      | GET    | Admin    | View all orders                |
| /api/orders/:id/status | PATCH  | Admin    | Update order status            |

## 📋 Sequence Diagram – Place Order Flow
1. Customer clicks 'Place Order'
2. POST `/api/orders`
3. Backend locks inventory
4. Saves order in MongoDB
5. Emits WebSocket to admin UI
6. Response to customer

## 🚀 Deployment Topology
- Frontend → Netlify (auto deploy from GitHub)
- Backend → Railway
- `.env` managed securely via host

## 🔐 Security
- Auth: JWT
- RBAC: Admin vs Customer roles
- Rate Limiting (future)
- Health Checks: `/healthz`
- Logs: Morgan
- Error Handling: Central error handler

