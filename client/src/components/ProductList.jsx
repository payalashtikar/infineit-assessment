import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Button,
    Snackbar
} from "@mui/material";
import axios from "axios";

const userId = "12345"; 

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8888/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (productId) => {
        if (!token) {
            setSnackbarMessage("Please log in to add products to your cart.");
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8888/cart/add",
                { productId, quantity: 1 }, // No need for userId
                {
                    headers: { Authorization: `Bearer ${token}` } // Token sends userId automatically
                }
            );

            if (response.data) {
                setSnackbarMessage("Product added to cart!");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setSnackbarMessage(error.response?.data?.message || "Failed to add product to cart.");
            setSnackbarOpen(true);
        }
    };



    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3, textAlign: "center" }}>
                Product List
            </Typography>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress size="3rem" />
                </div>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <Card sx={{ maxWidth: 300, mx: "auto", p: 2 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`http://localhost:8888/${product.image}`}
                                    alt={product.productName}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {product.productName || "No Name"}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Price: ${product.price || "N/A"}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={() => handleAddToCart(product._id)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default ProductList;
