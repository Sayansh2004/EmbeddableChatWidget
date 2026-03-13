const mongoose=require("mongoose");
const validator=require("validator");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50
    },
    lastName:{
         type:String,
        minLength:2,
        maxLength:50
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        validator(email){
            if(!validator.isEmail(email)){
                throw new Error("please enter a valid emailId")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        validator(pass){
            if(!validator.isStrongPassword(pass)){
                throw new Error("Weak password");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://github.com/shadcn.png",
        validate(url){
            if(!validator.isURL(url)){
                throw new Error("invalid Url");
            }
        }
    }
})

module.exports=mongoose.model("User",userSchema);