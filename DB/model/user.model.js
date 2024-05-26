import mongoose , {Schema , model} from "mongoose";

const userSchema = new Schema ({
    userName:{
        type:String ,
        required:true ,
        lowercase:true ,
        min : 3 ,
        max : 20
    },
    email:{
        type:String ,
        required:true ,
        unique:true ,
        lowercase:true , 
        trim:true
    },
    password:{
        type:String ,
        required:true
    },
    age:Number ,
    phone:String ,
    gender:{
        type:String ,
        enum:["male" , "female"] ,
        default :"male"
    },
    isConfirmed:{
        type:Boolean , 
        default :"false"
    },
    role:{
        type:String ,
        enum:["user" , "seller" , "admin"] ,
        default:"user"
    },
    forgetCode:String ,
    status :{
        type : String ,
        enum : ["offline" , "online" , "blocked"] ,
        default : "offline"
    },
    profileImages :{
        url:{
            type:String ,
            default:"https://res.cloudinary.com/dh5fn9ybu/image/upload/v1714766969/E-Commerce/users/defaults/profileImage/Blank-Profile-Picture_w5ry37.jpg"
        },
        id:{
            type:String ,
            default: "E-Commerce/users/defaults/profileImage/Blank-Profile-Picture_w5ry37"
        }
    },
    coverImages:[
        {
            url:
            {type:String},
            id:
            {type:String}
        }
    ]
},{timestamps:true})

const userModel = mongoose.models.user || model("User" , userSchema)

export default userModel