const express=require("express");
const cookieParser=require("cookie-parser");
const mongoose=require("mongoose");

const {userRouter}=require("./routes/user");
const {courseRouter}=require("./routes/course");
const { adminRouter } = require("./routes/admin");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
app.use(express.json());
app.use(cookieParser());

    
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter);

async function main(){
    await mongoose.connect(process.env.URI);
    app.listen(3333);
    console.log("listening on port 3000");
}

main()