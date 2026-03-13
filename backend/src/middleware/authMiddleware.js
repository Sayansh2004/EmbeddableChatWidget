const jwt = require("jsonwebtoken");
const User = require("../models/user");

// requireAuth is a "middleware" (a security checkpoint) for our backend routes.
// Before a user can create a widget or see analytics, they must pass through here.
const requireAuth = async (req, res, next) => {
    try {
        // Step 1: Check if the user brought their "VIP entry ticket" (the token).
        // This token is stored in the browser's cookies.
        const token = req.cookies?.token;
        if (!token) {
            // No ticket? Access denied!
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        // Step 2: Validate the ticket. 
        // We use our secret password (JWT_SECRET) to make sure the ticket is real and hasn't been faked.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 3: Find the user in our database using the ID stamped on the ticket.
        const user = await User.findById(decoded._id).select("_id firstName lastName emailId");
        if (!user) {
            // Ticket is real, but the user account doesn't exist anymore!
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Step 4: Attach the user's basic info to the `req` (request) object.
        // This means the next functions down the line (our controllers) know EXACTLY who is making the request.
        req.user = {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
        };

        // Step 5: They passed the security check! Let them proceed to the actual action.
        next();
    } catch (err) {
        // If the ticket was expired or fake, jwt.verify throws an error, and we end up here.
        console.error("Auth error:", err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = { requireAuth };

