const jwt=require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req,res,next){
    const token=req.cookies.access_token;
    if(!token){
        return res.status(403).send("you dont have cookies to access");
    }
    try{
    const decoded=jwt.verify(token,JWT_USER_PASSWORD);
    if(decoded){
        req.userId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message:"you are not signed in"
        })
    }
    }catch(e){
        return res.status(403);
    }
}

module.exports={
    userMiddleware
}