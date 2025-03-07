
import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8888/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const carts = response.data.data;
                const allProducts = carts.flatMap((cart) =>
                    cart.products.map((product) => ({
                        ...product,
                        cartId: cart._id,
                    }))
                );

                setCartItems(allProducts);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleRemoveFromCart = async (cartId, productId) => {
        try {
            await axios.delete(`http://localhost:8888/cart/${cartId}/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems(cartItems.filter((item) => item.productId._id !== productId));
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await axios.patch(
                `http://localhost:8888/cart/update-product-quantity/${productId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedCartItems = cartItems.map((item) =>
                item.productId._id === productId ? { ...item, quantity: newQuantity } : item
            );

            setCartItems(updatedCartItems);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    const handleConfirmOrder = async () => {
        try {
            const orderPayload = {

                products: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    price: item.productId.price,
                    quantity: item.quantity,
                    total: item.productId.price * item.quantity,
                })),
                totalAmount: cartItems.reduce(
                    (acc, item) => acc + item.productId.price * item.quantity,
                    0
                ),
            };

            await axios.post("http://localhost:8888/order/confirm", orderPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Order Confirmed Successfully!");
            setCartItems([]);
            setOpenConfirmModal(false);
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("Failed to confirm order.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3, textAlign: "center" }}>
                My Cart
            </Typography>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress size="3rem" />
                </div>
            ) : cartItems.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
                    Your cart is empty.
                </Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <img
                                                src={`http://localhost:8888/${item.productId.image}`}
                                                alt={item.productId.productName}
                                                style={{ width: 50, height: 50, objectFit: "cover" }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.productId.productName}</TableCell>
                                        <TableCell>${item.productId.price}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}>-</Button>
                                            {item.quantity}
                                            <Button onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}>+</Button>
                                        </TableCell>
                                        <TableCell>${item.productId.price * item.quantity}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleRemoveFromCart(item.cartId, item.productId._id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ textAlign: "right", marginTop: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleOpenConfirmModal}
                        >
                            Confirm Order
                        </Button>
                    </div>

                    {/* Confirm Order Modal */}
                    <Dialog open={openConfirmModal} onClose={handleCloseConfirmModal}>
                        <DialogTitle>Confirm Your Order</DialogTitle>
                        <DialogContent>
                            <Typography>User ID: {userId}</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item.productId._id}>
                                            <TableCell>{item.productId.productName}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${item.productId.price}</TableCell>
                                            <TableCell>${item.productId.price * item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Total Amount: $
                                {cartItems.reduce(
                                    (acc, item) => acc + item.productId.price * item.quantity,
                                    0
                                )}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseConfirmModal} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmOrder} variant="contained" color="primary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default Cart;

