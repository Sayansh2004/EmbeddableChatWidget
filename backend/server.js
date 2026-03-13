const dns = require("dns");
dns.setServers(['8.8.8.8','8.8.4.4']);

// Load environment variables early so configuration is available everywhere.
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./src/config/db.js");
const authRouter = require("./src/routes/auth");
const widgetRouter = require("./src/routes/widgets");
const publicChatRouter = require("./src/routes/publicChat");
const analyticsRouter = require("./src/routes/analytics");
const healthRouter = require("./src/routes/health");
const embedRouter = require("./src/routes/embed");

const { notFoundHandler } = require("./src/middleware/notFoundHandler"); // Handles 404 errors when a route doesn't exist
const { errorHandler } = require("./src/middleware/errorHandler"); // Catches crashes and sends clean errors back

// Import our new Rate Limiter worker
const rateLimit = require("express-rate-limit");

const app = express(); // Create the actual Express server (our shop)

// Global Rate Limiter: Protects our server from getting spammed (DDoS attack prevention)
// It says: "One single person (IP address) can only ask for 100 things every 15 minutes."
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 100, // Maximum 100 requests
    standardHeaders: true, // Tell the client how many requests they have left
    legacyHeaders: false,
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." }
});

// Apply the global rate limiter to our entire app immediately
app.use(globalLimiter);

// 1. FIX: Loosen Helmet's resource policy so external sites can load your script
app.use(
  helmet({
    crossOriginResourcePolicy: false, 
  })
);

app.use(express.json());
app.use(cookieParser());

// 2. FIX: Adjust CORS. 
// We allow the React frontend, but we also need to allow the domains where the widget is embedded.
// For development, we can allow all origins. For production, you'd check a whitelist of registered domains.
app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true); 
        },
        credentials: true,
    })
);


// Tell the app to use our routers (The Workers) for different paths!
// E.g., if a request goes to "/auth/login", the authRouter handles it.
app.use("/auth", authRouter);
app.use("/widgets", widgetRouter);
app.use("/public", publicChatRouter);
app.use("/analytics", analyticsRouter);
app.use("/embed", embedRouter);
app.use("/health", healthRouter);

// Set up error handlers (The clean-up crew) at the very end
app.use(notFoundHandler); // If the URL wasn't matched above, send a 404 Not Found
app.use(errorHandler);    // If something crashed inside a worker, send a 500 Server Error


const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is listening on port : ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();