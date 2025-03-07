import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();


    return (
        <AppBar position="static">
            <Toolbar>
                <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                    <Typography variant="h6">Ecommerce(Admin) website</Typography>
                    <div>
                        <Button color="inherit" component={Link} to="/homepage">Home</Button>
                        <Button color="inherit" component={Link} to="/addProduct">Add Product</Button>
                    </div>
                </div>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;