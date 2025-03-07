import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress
} from '@mui/material';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8888/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3, textAlign: 'center' }}>
                My Orders
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : orders.length === 0 ? (
                <Typography>No orders found.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Order Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>
                                    {order.products.map((product, index) => (
                                        <div key={index}>
                                            {product.productName} (x{product.quantity})
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>${order.totalAmount}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Container>
    );
};

export default MyOrders;
