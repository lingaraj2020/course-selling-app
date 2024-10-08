const jwt=require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req,res,next){
    const token=req.cookies.access_token;
    if(!token){
        return res.status(403).send("invalid cookie");
    }
    try{
    const decoded=jwt.verify(token,JWT_USER_PASSWORD);
    if(decoded){
        req.userId=decoded.id;
        console.log(req.userId);
        next();

        const userId=req.userId;
        if(numberOfRequestsForUser[userId]){
            numberOfRequestsForUser[userId]+=1;
            if(numberOfRequestsForUser[userId]>5){
                return res.status(404).send("you are no entry");
            }else{
                next();
            }
        }else{
            numberOfRequestsForUser[userId]=1;
            next();
        }
        
        let numberOfRequestsForUser = {};
        setInterval(() => {
          numberOfRequestsForUser = {};
        }, 1000);

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