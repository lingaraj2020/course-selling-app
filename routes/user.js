
const {Router} = require("express");
const { usermodel, coursemodel, purchasemodel } = require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middlewares/user");

const userRouter=Router();

userRouter.post("/signup",async (req,res)=>{
    try{
        const {email,password,firstName,lastName}=req.body; //add zod
        //add bcrypt
        //put in try catch block
        await usermodel.create({
            email:email,
            password:password,
            firstName:firstName,
            lastName:lastName
        })
        res.json({
            message:"user signup succeed"
        })
    }catch(e){
        console.log(e);
    }   
})

userRouter.post("/signin",async (req,res)=>{
    const {email,password}=req.body;

    const user=await usermodel.findOne({
        email:email,
        password:password
    })
    if(user){
        const token=jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD)

        res.json({
            token:token
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

module.exports={
    userRouter:userRouter
}