const jwt=require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminRouter } = require("../routes/admin");

function adminMiddleware(req,res,next){
    const token=req.cookies.access_token;
    if(!token){ 
        return res.status(403).send("invalid cookie")
    }
    const decoded=jwt.verify(token,JWT_ADMIN_PASSWORD);
    if(decoded){
        req.adminId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message:"you are not logged in"
        })
    }
}

module.exports={
    adminMiddleware
}