const express = require('express');
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/",(req,res)=>{
    let error = req.flash("error");
    res.render('index', { error, loggedin: false });
});

router.get("/shop",isloggedin, async (req,res)=>{
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop",{ products, success });
});

router.get("/cart",isloggedin, async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate("cart");
    // const bill = Number(user.cart[0].price)+20-Number(user.cart[0].discount);
    res.render("cart", { user });
});

router.get("/account",isloggedin, async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    res.render("MyAccount", { user });
});

router.get("/addtocart/:productid",isloggedin, async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to cart");
    res.redirect("/shop"); 
});

router.get("/logout",isloggedin,(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
})

module.exports = router;