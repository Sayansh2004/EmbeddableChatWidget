# 🤖 ChatBot Widget Platform

A full-stack web application that allows users to create, customize, and deploy interactive chatbot widgets on any website.

**Built with:** React (Frontend) · Node.js & Express (Backend) · MongoDB (Database)

---

## 🌟 Project Overview & Architecture

This platform is divided into two main architectural pieces:

1. **The Dashboard (Creator Portal):** A protected, authenticated React frontend where users can design their chatbot (colors, avatar, welcome message, etc.). It communicates with a secure Node/Express backend that saves the configurations to a MongoDB database.

2. **The Embeddable Widget (Public Facing):** A heavily optimized, isolated React component designed to be injected into *any* host website via a single `<script>` tag. When loaded, it fetches its specific configuration from a public backend route using its unique `widgetId` and renders a functional chat interface.

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or a MongoDB Atlas URI)

### Backend Setup

1. Navigate to the backend folder:
```bash
   cd backend
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file in the `backend` folder:
```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/chatbotdb
   JWT_SECRET=super_secret_jwt_key_here_change_me
   NODE_ENV=development
```

4. Start the backend server:
```bash
   npm run dev
```

### Frontend Setup

1. Navigate to the frontend folder:
```bash
   cd frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file in the `frontend` folder:
```env
   VITE_API_BASE_URL=http://localhost:3000
```

4. Start the frontend development server:
```bash
   npm run dev
```

5. Open your browser at the URL provided by Vite (usually `http://localhost:5173`).

---

## 📸 Screenshots

| Dashboard | Widget Preview |
|-----------|---------------|
| ![Dashboard](./assets/dashboard.png) | ![Widget](./assets/widgets.png) |

| Login | Analytics |
|-------|-----------|
| ![Login](./assets/login.png) | ![Analytics](./assets/analytics.png) |

---

## 🛠️ How to Create & Embed a Widget

### Step 1: Create a Widget
1. Log in or Sign up on the platform.
2. From the Dashboard, click the **"+ Create Widget"** button.
3. Use the left-hand form to customize your widget:
   - Name your widget and bot.
   - Adjust the **Primary**, **Accent**, and **Background** colors.
   - Add a custom **Welcome Message** and an **Avatar URL**.
   - Watch the **Live Preview** on the right update instantly as you type!
4. Click **"Save Changes"**.

### Step 2: Generate the Embed Snippet
1. Return to the Dashboard where your new widget is listed.
2. Click **"Copy embed code"** on your widget's card.
3. Paste the snippet into the `<body>` tag of your target HTML website:
```html
   <script
     src="http://localhost:5173/embed/chatbot.js"
     data-widget-id="YOUR_WIDGET_ID"
     async
   ></script>
```
4. Refresh your target website — your customized chatbot will appear in the corner!

---

## 🔥 4 Mandatory Self-Initiated Improvements

### 1. 🛡️ Security: API Rate Limiting (DDoS & Abuse Protection)

**What it is:** Global rate limiting via `express-rate-limit` on the backend.

**Problem:** The public chat endpoint (`/public/widgets/:id/messages`) allows any anonymous user to send messages. Without protection, a malicious actor could send thousands of requests per second, crashing the server or racking up database costs.

**Solution:** The rate limiter caps requests to **100 per 15 minutes per IP address**, keeping the server stable and immune to basic spam/DDoS attacks.

---

### 2. 💬 User Experience: Suggestion Capsules (Quick Replies)

**What it is:** Custom schema fields and UI for clickable quick-reply capsules inside the chat widget.

**Problem:** When users face a blank chatbot input, they often don't know what to ask (*blank canvas syndrome*), leading to lower engagement and higher drop-off.

**Solution:** Dashboard owners can define custom quick replies (e.g., `"Pricing?"`, `"Support?"`). These render as clickable capsules inside the widget, guiding conversations and dramatically improving engagement.

---

### 3. 📊 Feature Expansion: Advanced Analytics Dashboard & Conversation History

**What it is:** A dedicated `AnalyticsPage.jsx` fetching grouped data from a specialized backend endpoint.

**Problem:** The assignment requested basic total counts, but raw totals aren't actionable for a business owner trying to understand user intent.

**Solution:** An advanced analytics page displays a **7-day daily activity chart** AND a **Full Message History inspector**. Widget owners can click into specific sessions and read exact chat transcripts, providing real business intelligence value.

---

### 4. ✉️ User Experience: Nodemailer Welcome Email Confirmation

**What it is:** Automated welcome emails sent on successful registration via `nodemailer` and Gmail SMTP.

**Problem:** A simple success message on screen isn't enough to assure new users their account is ready — especially for a professional SaaS-like platform.

**Solution:** A backend email service asynchronously dispatches a beautiful, HTML-formatted welcome email on registration, giving users professional confirmation, a direct dashboard link, and an immediate support touchpoint.

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | Dashboard & embeddable widget UI |
| Backend | Node.js + Express | REST API, authentication, business logic |
| Database | MongoDB | Widget configs, users, messages |
| Auth | JWT | Secure dashboard authentication |
| Email | Nodemailer + Gmail SMTP | Welcome email on registration |
| Rate Limiting | express-rate-limit | DDoS & spam protection |

---

## 📁 Project Structure
```
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── main.jsx
│   └── public/embed/
└── assets/
    ├── dashboard.png
    ├── analytics.png
    ├── login.png
    └── widgets.png
```

---

## 📄 License

