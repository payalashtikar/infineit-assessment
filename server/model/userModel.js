const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, default: "", unique: true },
    password: { type: String, default: "" },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    token: { type: String, default: "" },
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false },
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User