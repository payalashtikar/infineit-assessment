const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const connectDB = require('./db/dbconnect');

const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use("/uploads", express.static("uploads"));

// ✅ Routes (Only Once)
app.use(require('./routes/userRoute'));
app.use(require('./routes/productRoute'));

app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Server running on port`, port);
});
