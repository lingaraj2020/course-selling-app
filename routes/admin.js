const {Router} = require("express");
const { adminmodel, coursemodel } = require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");

const adminRouter=Router();

adminRouter.post("/signup",async(req,res)=>{
    try{
        const {email,password,firstName,lastName}=req.body;

        await adminmodel.create({
            email:email,
            password:password,
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
        email:email,
        password:password
    })
    if(admin){
        const token=jwt.sign({
            id:admin._id
        },JWT_ADMIN_PASSWORD)

        res.json({
            token:token
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

module.exports={
    adminRouter:adminRouter
}