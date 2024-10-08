const {Router} = require("express");
const { adminmodel, coursemodel } = require("../database/db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");
const zod=require("zod");

const adminRouter=Router();
const adminParsedData=zod.object({
    email:zod.string({
        message:"email is required"
    }).email({message:"invalid email address"}),
    password:zod.string({
        required_error:"password must be 8 or more characters"
    }).min(8,{message:"password must have atleast 8 characters"}),
    firstName:zod.string(),
    lastName:zod.string()

})
adminRouter.post("/signup",async(req,res)=>{
    try{
        const parsedsuccess=adminParsedData.safeParse(req.body);
        
        if(!parsedsuccess.success){
            res.status(411).json({
                message:"enter valid data",
                errors:parsedsuccess.error.errors
            })
        }
        const {email,password,firstName,lastName}=req.body;
        
        const Adminpassword=await bcrypt.hash(password,5);
        console.log(Adminpassword);

        await adminmodel.create({
            email:email,
            password:Adminpassword,
            firstName:firstName,
            lastName:lastName
        })
        res.json({
            message:"admin signup succeed"
        })
    }catch(e){
        console.log(e);
    }
    
})

adminRouter.post("/signin",async(req,res)=>{
    const {email,password}=req.body;

    const admin=await adminmodel.findOne({
        email:email
    })
    const passwordMatch=bcrypt.compare(password,admin.password);

    if(admin && passwordMatch){
        const token=jwt.sign({
            id:admin._id
        },JWT_ADMIN_PASSWORD)

        return res.cookie("access_token",token,{
            httpOnly:true
        }).status(200).json({
            message:"admin logged in successfully 😊"
        })
    }else{
        res.status(411).json({
            message:"incorrect credentials"
        })
    }
    
})

adminRouter.post("/course",adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;

    const {title,description,price,imageURL}=req.body;
    const course=await coursemodel.create({
        title:title,
        description:description,
        imageUrl:imageURL,
        price:price,
        creatorId:adminId
    })
    res.json({
        message:"course created",
        courseId:course._id
    })
})

adminRouter.put("/course",adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;

    const {title,description,price,imageURL,courseId}=req.body;
    const course=await coursemodel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title:title,
        description:description,
        imageUrl:imageURL,
        price:price
    })

    res.json({
        message:"course updated",
        courseId:course._id
    })
})

adminRouter.get("/course/bulk",adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;

    const courses=await coursemodel.find({
        creatorId:adminId
    })

    res.json({
        courses
    })
})

adminRouter.get("/logout",adminMiddleware,(req,res)=>{
    return res.clearCookie("access_token")
            .status(200).json({
                message:"Successfully logged out 🫡"
            })
})

module.exports={
    adminRouter:adminRouter
}