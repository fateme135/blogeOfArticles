const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const article=new Schema({
    name: String,
    author: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
   // author:String,
    shortTxt: String,
    longTxt: String,
    date: String,
    link: String,
   

})

module.exports=mongoose.model("article", article);