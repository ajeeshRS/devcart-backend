const mongoose = require("mongoose")

const userCartSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    }]
})

module.exports = mongoose.model('userCart',userCartSchema)