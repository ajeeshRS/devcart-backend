const mongoose = require("mongoose")

const  orderDetailsSchema  = mongoose.Schema({
orderId:{
    type:String,
    required:true
},
productDetails:{
    type:Array,
    required:true
},
userId:{
    type:String,
    required:true
},
amount:{
    type:Number,
    required:true
},
paymentId:{
    type:String,
    required:true
}
,
address:{
    type:Object,
    required:true
},
discount:{
    type:Number
}
,
date:{
    type:Date,
    required:true
}
})

module.exports= mongoose.model("orderDetails",orderDetailsSchema)