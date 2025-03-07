const express = require("express");
const multer = require("multer");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");


const router = express.Router();

// Multer setup for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/add-product", upload.single("image"), async (req, res) => {
    try {
        const { productName, price } = req.body;

        if (!productName || !price || !req.file) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newProduct = new Product({
            productName,
            price: parseFloat(price),
            image: req.file.path,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add to cart
router.post("/cart", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [{ productId, quantity }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }

        await cart.save();
        res.json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
