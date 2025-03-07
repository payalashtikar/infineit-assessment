import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress
} from "@mui/material";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchProducts();
    }, []);

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
                            <Card sx={{ maxWidth: 300, mx: "auto" }}>
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
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ProductList;
