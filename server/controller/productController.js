const Product = require("../model/productModel");

const addProduct = async (req, res) => {
    try {

        const { productName, price } = req.body;

        if (!productName || !price || !req.file) {
            return res.status(400).json({ message: "Product name, price, and image are required" });
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }

        const product = await Product.create({ productName, price, image: imageUrl });

        return res.status(201).json({ message: "Product added successfully", data: product });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




module.exports = { addProduct };
