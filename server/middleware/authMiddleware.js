const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require('../model/userModel');

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json({ message: "you must login first" })
    }

    const token = authorization.split(' ')[1]
    if (!token) {
        return res.status(400).json({ message: "you must login first" })
    }

    jwt.verify(token, process.env.SECRETKEY, (error, payload) => {
        if (error) {
            return res.status(400).json({ message: "token must needed" })
        }
        User.findById({ _id: payload.userId }).then((userData) => {
            if (!userData) {
                return res.status(400).json({ message: "user does not exist" })
            }
            req.user = userData
            next()
        })
    })
}
module.exports = authMiddleware