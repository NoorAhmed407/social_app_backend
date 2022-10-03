const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const User = require('../Models/Users');
const authMiddleware = require('./../Middlewares/AuthMiddleware');

require('dotenv').config();


router.post('/register', register);
router.post('/login', login);



async function login(req,res){
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: 'Email or Password is Required'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({success: false, message: 'User Not Found. Please Register'});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({success: false, message: 'Invalid Credentials'});
    }

    const token = jwt.sign({...user},process.env.SALT_KEY, {expiresIn: "2h"});

    return res.status(200).json({
        message: 'User LoggedIn Successfully',
        success: true,
        data: {id: user.id, name: user?.name, email: user?.email,  token},
    });

}   


async function register(req,res){
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: 'All Fields are required'});
    }

    const user = await User.findOne({email});

    if(user){
        return res.status(400).json({success: false, message: 'User Already Exists'});
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({name, email: email.toLowerCase(), password: encryptedPassword});

    
    return res.status(200).json({
        success: true.valueOf,
        message: 'User Regisgtered Successfully',
        data: newUser
    });

}



module.exports = router;