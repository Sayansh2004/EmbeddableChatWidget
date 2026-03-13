# Chatbot Widget Platform

A full-stack web application that allows users to create, customize, and deploy interactive chatbot widgets on any website. 

Built with React (Frontend), Node.js & Express (Backend), and MongoDB (Database).

## 🌟 Project Overview & Architecture
This platform is divided into two main architectural pieces:
1. **The Dashboard (Creator Portal):** A protected, authenticated React frontend where users can design their chatbot (colors, avatar, welcome message, etc.). It communicates with a secure Node/Express backend that saves the configurations to a MongoDB database.
2. **The Embeddable Widget (Public Facing):** A heavily optimized, isolated React component designed to be injected into *any* host website via a single `<script>` tag. When loaded, it fetches its specific configuration from a public backend route using its unique `widgetId` and renders a functional chat interface.

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or a MongoDB URI)

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/chatbotdb  # Or your MongoDB Atlas URI
   JWT_SECRET=super_secret_jwt_key_here_change_me
   NODE_ENV=development
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder and add the following:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit the URL provided by Vite (usually `http://localhost:5173`).

---

## 📸 Screenshots
*(Note: Please replace these placeholder paths with actual screenshots of your running app before submitting!)*

- **Dashboard:** `![Dashboard Screenshot](./assets/dashboard.png)`
- **Widget Live Preview:** `![Preview Screenshot](./assets/preview.png)`
- **Embed In Action:** `![Embed Screenshot](./assets/embed.png)`

---

## 🛠️ How to Create & Embed a Widget

**Step 1: Create a Widget**
1. Log in or Sign up on the platform.
2. From the Dashboard, click the **"+ Create Widget"** button.
3. Use the left-hand form to customize your widget:
   - Name your widget and bot.
   - Adjust the **Primary**, **Accent**, and **Background** colors.
   - Add a custom **Welcome Message** and an **Avatar URL**.
   - Watch the **Live Preview** on the right update instantly as you type!
4. Click **"Save Changes"**.

**Step 2: Generate the Embed Snippet**
1. Return to the Dashboard where your new widget is listed.
2. Click **"Copy embed code"** on your widget's card.
3. Paste the generated snippet anywhere in the `<body>` tag of your target HTML website:
   ```html
   <script src="http://localhost:5173/embed/chatbot.js" data-widget-id="YOUR_WIDGET_ID" async></script>
   ```
4. Refresh your target website, and your customized chatbot will appear in the corner!

---

## 🔥 4 Mandatory Self-Initiated Improvements

Beyond the standard requirements, I architected and implemented the following 4 improvements to make this platform robust, secure, and production-ready:

### 1. Security: API Rate Limiting (DDoS & Abuse Protection)
* **What it is:** Global rate limiting implemented via `express-rate-limit` on the backend.
* **Why I added it (The Problem):** The public chat endpoint (`/public/widgets/:id/messages`) allows any anonymous user to send messages to the bot. Without protection, a malicious actor could write a script to send 10,000 messages a second, crashing the server or racking up database costs.
* **The Solution:** The rate limiter caps requests (e.g., 100 requests per 15 minutes per IP address), ensuring the server remains stable and immune to basic spam/DDoS attacks.

### 2. User Experience: Suggestion Capsules (Quick Replies)
* **What it is:** Custom schema fields and UI implementation for clickable "Suggestion Capsules" within the chat UI.
* **Why I added it (The Problem):** When users face a blank chatbot input, they often don't know what to ask (blank canvas syndrome), leading to lower engagement.
* **The Solution:** I extended the configuration model so dashboard owners can define custom quick replies (e.g., "Pricing?", "Support?"). These render inside the public widget, drastically improving user engagement and guiding the conversation.

### 3. Feature Expansion: Advanced Analytics Dashboard & Conversation History
* **What it is:** A dedicated Analytics UI (`AnalyticsPage.jsx`) that fetches grouped data from a specialized backend endpoint.
* **Why I added it (The Problem):** The assignment requested basic "total" counts, but raw totals aren't actionable for a business owner trying to understand user intent.
* **The Solution:** I built an advanced analytics page that displays a 7-day daily activity chart AND a **Full Message History** inspector. Widget owners can now click into specific sessions and read the exact chat transcripts between their visitors and the bot, providing immense business value.

### 4. User Experience (UX): Nodemailer Welcome Email Confirmation
* **What it is:** Automated welcome emails sent to users immediately upon successful registration using `nodemailer` and Gmail SMTP.
* **Why I added it (The Problem):** When users sign up for a new platform, they expect immediate feedback. A simple success message on the screen isn't always enough to assure them their account is ready to use, especially for a professional SaaS-like dashboard.
* **The Solution:** I integrated a backend email service that asynchronously dispatches a beautiful, HTML-formatted welcome email as soon as the user record is saved to the database. This gives new users a professional confirmation, a direct link back to the dashboard, and an immediate touchpoint for support, vastly improving the initial onboarding UX.

---
