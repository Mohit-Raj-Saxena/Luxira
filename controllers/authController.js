const userModel = require('../models/user-model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateToken");
const { response } = require('express');

module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname, contact } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash('error', 'You already have an account. Please login');
            return res.redirect("/");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                        contact
                    });
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.redirect("/shop");
                }
            });
        });

    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect("/");
    }

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        } else {
            req.flash('error', 'Invalid email or password');
            return res.redirect("/");
        }
    });
};

module.exports.logout = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
};