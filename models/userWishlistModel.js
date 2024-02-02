const mongoose =require("mongoose")

const wishListSchema = new mongoose.Schema({
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

module.exports = mongoose.model('wishlist',wishListSchema)