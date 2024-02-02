const mongoose= require("mongoose")

const addressSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'user'
},
fullName: {
    type:String,
    required:true
},
phoneNo: {
    type:Number,
    required:true
},
street: {
    type: String,
    required: true
  },
city: {
    type: String,
    required: true
  },
state: {
    type: String,
    required: true
  },
pinCode: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model("address",addressSchema)