import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("price", price);
        formData.append("image", image);

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8888/add-product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Product added successfully");
            setProductName("");
            setPrice("");
            setImage(null);
            navigate("/homepage");
        } catch (error) {
            alert("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <>
            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size="3rem" />
                </div>
            ) : (
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", my: 4 }}>
                        <h2>Add Product</h2>
                    </Box>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{ marginTop: "16px", display: "block" }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Add Product
                        </Button>
                    </form>
                </Container>
            )}
        </>
    );
};

export default AddProduct;
