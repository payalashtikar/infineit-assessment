const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../model/userModel")
const Cart = require("../model/cartModel")
const orderModel = require("../model/orderModel")

const register = async (req, res) => {
    try {
        const { email, password, } = req.body

        if (!email || !password) {
            return res.status(404).json({ message: "please fill all required data" })
        }

        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(404).json({ message: "user exist with same email " })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({ email, password: hashedPassword })
        return res.status(200).json({ message: "Registration success", data: newUser })
    }
    catch (error) {
        throw error
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({ message: "please fill all required data" })
        }

        const user = await User.findOne({ email: email, })
        if (!user) {
            return res.status(404).json({ message: "user does not exist" })
        }

        if (user.role == "user") {

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid Credentials", data: null })
            }

            const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY)
            const updateUserData = await User.findByIdAndUpdate({ _id: user._id }, { $set: { token: token } }, { new: true })
            return res.status(200).json({ message: "Login success", data: updateUserData })
        }
        if (user.role == "admin") {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid Credentials", data: null })
            }

            const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY)
            const updateUserData = await User.findByIdAndUpdate({ _id: user._id }, { $set: { token: token } }, { new: true })
            return res.status(200).json({ message: "Login success", data: updateUserData })
        }
    }
    catch (error) {
        throw error
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById({ _id: userId, delete: false, active: true })
        if (user) {
            await User.findByIdAndUpdate(user, { $set: { token: "" } }, { new: true })
            return res.status(200).json({ message: "logout successfully" })
        }
        else {
            return res.status(200).json({ message: "something went wrong !!" })
        }
    }
    catch (error) {
        throw error
    }
}


const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId: req.user._id, products: [{ productId, quantity }] });
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
}


const getCartProducts = async (req, res) => {
    try {
        const userId = req.user._id;   

        const cond = { userId: userId, delete: false, active: true };
        const cart = await Cart.find(cond)
            .populate("products.productId", "productName price image");

        return res.status(200).json({ message: "Cart fetched successfully", data: cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: error.message });
    }
};

const removeFromItem = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;  

    try {
        const cart = await Cart.findOneAndUpdate({ userId, delete: true, active: false })

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(
            (product) => product.productId.toString() !== productId
        );

        if (cart.products.length === 0) {
            cart.active = false;
            cart.delete = true;
        }

        await cart.save();

        res.json({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const updateProductQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body; 
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId, delete: false, active: true });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = cart.products.find(
            (item) => item.productId.toString() === productId
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        product.quantity = quantity;

        await cart.save();

        res.status(200).json({ message: "Quantity updated successfully", cart });
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const confirmOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;
        const userId = req.user._id;


        if (!userId || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ message: "Missing required order data" });
        }

        const order = new orderModel({
            userId,
            products,
            totalAmount,
            status: 'Confirmed'
        });


        await order.save();

        return res.status(201).json({
            message: 'Order confirmed successfully!',
            order
        });

    } catch (error) {
        console.error("Error confirming order:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id; 

        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = { register, login, logout, addToCart, getCartProducts, removeFromItem, updateProductQuantity, confirmOrder, getMyOrders }