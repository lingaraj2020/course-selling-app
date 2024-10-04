
const {Router} = require("express");
const { usermodel, coursemodel, purchasemodel } = require("../database/db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middlewares/user");
const zod=require("zod");

const requiredSchema=zod.object({
    email:zod.string({
        required_error:"email is required"
    }).email({message:"invalid email address"}),
    password:zod.string({
        required_error:"password is required"})
        .min(8,{message:"password must atleast 8 characters"}),
    firstName:zod.string(),
    lastName:zod.string()
})

const userRouter=Router();

userRouter.post("/signup",async (req,res)=>{
    try{
        const parsedbody= requiredSchema.safeParse(req.body)
        if(!parsedbody.success){
            res.status(400).json({
                message:"enter valid content",
                errors:parsedbody.error.errors
            })
        }

        const {email,password,firstName,lastName}=req.body; 
       
        const hashedPassword=await bcrypt.hash(password,5);
        const existingUser=await usermodel.findOne({
            email:email
        })
        if(existingUser){
            return res.json({
                msg:"email laready taken"
            })
        }
        const user=await usermodel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        })
        const token=jwt.sign({
            userId:user._id
        },JWT_USER_PASSWORD)
        return res.cookie("access_token",token,{
            httpOnly:true})
            .status(200).json({
                msg:"user signedup successfully"
            })
    }catch(e){
        console.log(e);
    }   
})

userRouter.post("/signin",async (req,res)=>{
    const {email,password}=req.body;

    const user=await usermodel.findOne({
        email:email
    })
    if(!user){
        return res.status(404).json({
            msg:"user not found"
        })
    }
    const passwordMatch=bcrypt.compare(password,user.password);
    if(!passwordMatch){
        return res.status(403).json({
            msg:"invalid password"
        })
    }
    if(passwordMatch){
        const token=jwt.sign({
            userId:user._id
        },JWT_USER_PASSWORD)

        return res.cookie("access_token",token,{
            httpOnly:true
        }).status(200).json({
            message:"Logged in successfully 🙏"
        })
    }
    else{
        res.status(411).json({
            message:"incorrect credentials"
        })
    }
})

userRouter.get("/purchases",userMiddleware,async(req,res)=>{
    const userId=req.userId;

    const purchases=await purchasemodel.find({
        userId
    })
    const coursesData=await coursemodel.find({
        _id:purchases.map(x=>x.courseId)
    })
    res.json({
        purchases,
        coursesData
    })
})

userRouter.get("/logout",userMiddleware,(req,res)=>{
    return res.clearCookie("access_token")
            .status(200).json({
                message:"Successfully logged out 🫡"
            })
})

module.exports={
    userRouter:userRouter
}