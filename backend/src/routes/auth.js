const express=require("express");
const { signUp, login, logout, getProfile } = require("../controllers/authControllers");
const { requireAuth } = require("../middleware/authMiddleware");

const authRouter=express.Router()


authRouter.post("/signup",signUp);
authRouter.post("/login",login);
authRouter.post("/logout",logout);

// NEW: Endpoint to get the currently logged in user based on their cookie
authRouter.get("/me", requireAuth, getProfile);


module.exports=authRouter;
