const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const User = require('../Models/Users');
const Post = require('../Models/Posts');
const authMiddleware = require('./../Middlewares/AuthMiddleware');

require('dotenv').config();


router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getUserDetails);



async function getUserDetails(req,res){
    let authUser = req?.user;
    try{
        const data = await User.findOne({_id: authUser?.id}).select('-password -createdAt -updatedAt -__v');
        const postsData = await Post.find({postedBy: authUser?.id }).select('-postedBy -createdAt -updatedAt -__v');
        if(data){
            return res.status(200).json({
                message: 'User Details Fetched Successfully',
                success: true,
                data: {...data?._doc, posts: postsData},
            });
        }
        else{
        return res.json({success: false, message: err.message});

        }
    }
    catch(err){
        return res.json({success: false, message: err.message});
    }
}



async function login(req,res){
    try{
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

    const token = jwt.sign({name: user.name, email: user.email, id: user._id},process.env.SALT_KEY, {expiresIn: "2h"});

    return res.status(200).json({
        message: 'User LoggedIn Successfully',
        success: true,
        data: {id: user.id, name: user?.name, email: user?.email,  token},
    });
    }
    catch(err){
        return res.json({success: false, message: err.message});
    }
}   


async function register(req,res){
  try{
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
        success: true,
        message: 'User Registered Successfully',
    });
  }
  catch (err){
    return res.json({success: false, message: err.message});
  }
}



module.exports = router;