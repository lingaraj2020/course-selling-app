const {Router}=require("express");
const { userMiddleware } = require("../middlewares/user");
const { purchasemodel, coursemodel } = require("../database/db");

const courseRouter=Router();

courseRouter.post("/purchase",userMiddleware,async(req,res)=>{
    const userId=req.userId;
    const courseId=req.body.courseId;
    //check user paid or not
    await purchasemodel.create({
        userId,
        courseId
    })
    res.json({
        message:"you have successfully brought this course"
    })
})

courseRouter.get("/preview",async(req,res)=>{
    const courses=await coursemodel.find({})
    res.json({
        courses
    })
})

module.exports={
    courseRouter:courseRouter
}