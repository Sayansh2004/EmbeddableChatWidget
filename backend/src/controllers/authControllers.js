const { validateSignUpData } = require("../utils/signupValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
const { sendWelcomeEmail } = require("../utils/emailService");

const signUp = async (req, res) => {
    try {
     
        validateSignUpData(req);

        const { firstName, lastName, password, emailId, photoUrl } = req.body;

       
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is already registered" 
            });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

    
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            photoUrl
        });

        await newUser.save();
        
        // Send a welcome email asynchronously
        sendWelcomeEmail(emailId, firstName);

        return res.status(201).json({ 
            success: true, 
            message: "User signed up successfully!" 
        });

    } catch (err) {
    
        return res.status(400).json({ 
            success: false, 
            message: err.message || "Failed to sign up user" 
        });
    }
};



const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        
        if (!emailId || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        
        const user = await User.findOne({ emailId });
        if (!user) {
           
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

      
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });

       
        res.cookie("token", token, {
            maxAge: 3 * 24 * 60 * 60 * 1000, 
            httpOnly: true,                
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",            
        });

        return res.status(200).json({ 
            success: true, 
            message: "User logged in successfully",
            data: { firstName: user.firstName, lastName: user.lastName } 
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}
const logout=async(req,res)=>{
    res.clearCookie("token",{
           maxAge: 3 * 24 * 60 * 60 * 1000, 
            httpOnly: true,                
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",     
    });
    return res.status(200).json({success:true,message:"User logged out successfully"})
}

// NEW: getProfile - used by the frontend when the page refreshes to re-login the user
const getProfile = async (req, res) => {
    try {
        // req.user is populated by the requireAuth middleware.
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: { 
                firstName: req.user.firstName, 
                lastName: req.user.lastName 
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { signUp ,login,logout, getProfile};