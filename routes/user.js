
const {Router} = require("express");
const { usermodel, coursemodel, purchasemodel } = require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middlewares/user");
const zod=require("zod");

const requiredSchema=zod.object({
    email:zod.string().email(),
    password:zod.string({
        required_error:"password must be 8 characters"
    }).min(8),
    firstName:zod.string(),
    lastName:zod.string()
})

const userRouter=Router();

userRouter.post("/signup",async (req,res)=>{
    try{
        const {email,password,firstName,lastName}=req.body; 
        const parsedbody= requiredSchema.safeParse(req.body)
        if(!parsedbody){
            res.json({
                message:"enter valid content"
            })
        }
        
        const hashedPassword=bcrypt.hash(password,5);
        console.log(hashedPassword);

        await usermodel.create({
            email:email,
            password:hashedPassword,
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
    const passwordMatch=bcrypt.compare(password,user.password);

    if(user && passwordMatch){
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