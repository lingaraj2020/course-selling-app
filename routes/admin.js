const {Router} = require("express");

const adminRouter=Router();

adminRouter.post("/signup",(req,res)=>{
    res.json({
        message:"admin signup endpoint"
    })
})

adminRouter.post("/signin",(req,res)=>{
    res.json({
        message:"admin signin endpoint"
    })
})

adminRouter.post("/course",(req,res)=>{
    res.json({
        message:"admin course endpoint"
    })
})

adminRouter.put("/course",(req,res)=>{
    res.json({
        message:"admin course endpoint"
    })
})

adminRouter.get("/course/bulk",(req,res)=>{
    res.json({
        message:"admin course endpoint"
    })
})

module.exports={
    adminRouter:adminRouter
}