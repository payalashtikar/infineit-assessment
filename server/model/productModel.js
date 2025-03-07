const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: { type: String, default: "" },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},
    { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product