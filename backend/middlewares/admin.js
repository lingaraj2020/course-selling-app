const jwt=require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminRouter } = require("../routes/admin");

function adminMiddleware(req,res,next){
    const token=req.cookies.access_token;
    if(!token){ 
        return res.status(403).send("invalid cookie")
    }
    try{
    const decoded=jwt.verify(token,JWT_ADMIN_PASSWORD);
    if(decoded){
        req.adminId=decoded.id;
        next();

        const adminId=re.adminId;
        if(numberOfRequestForAdmin[adminId]){
            numberOfRequestForAdmin[adminId]+=1;
            if(numberOfRequestForAdmin[adminId]>5){
                return res.status(404).send('you are no entry');
            }else{
                next();
            }
        }else{
            numberOfRequestForAdmin[adminId]=1;
            next();
        }

        let numberOfRequestForAdmin={}
        setInterval(()=>{
            numberOfRequestForAdmin={}
        },1000)

    }else{
        res.status(403).json({
            message:"you are not logged in"
        })
    }
    }catch(e){
        res.status(403)
    }
}

module.exports={
    adminMiddleware
}