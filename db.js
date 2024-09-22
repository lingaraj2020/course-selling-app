const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId;


const UserSchema=new Schema({
    email:{
        type:String,
        unique:true
    },
    password:String,
    firstname:String,
    lastname:String
})

const adminSchema=new Schema({
    email:{
        type:String,
        unique:true
    },
    password:String,
    firstname:String,
    lastname:String
})

const CourseSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const purchaseSchema=new Schema({
    userId:ObjectId,
    courseId:ObjectId

})


const usermodel=mongoose.model("user",UserSchema);
const coursemodel=mongoose.model("course",CourseSchema);
const adminmodel=mongoose.model("admin",adminSchema);
const purchasemodel=mongoose.model("purchase",purchaseSchema);

module.exports={
    usermodel,
    coursemodel,
    adminmodel,
    purchasemodel
}
