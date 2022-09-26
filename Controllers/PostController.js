const express = require('express');
const router = express.Router();
const Post = require('../Models/Posts');
const authMiddleware = require('./../Middlewares/AuthMiddleware');




router.post('/', authMiddleware, getPosts);
router.post('/add', authMiddleware, addPost);
router.post('/edit', authMiddleware, editPost);
router.post('/delete', authMiddleware, deletePost);

//AddPost
async function addPost(req,res){
 
}


//DeletePost
function deletePost(req,res){
    
}


//EditPost
function editPost(req,res){
    
}

//GetPosts
async function getPosts(req,res){
    try{
        const posts = await Post.find({}).populate({path: 'postedBy', select: ['name profile_pic']});
        return res.json({success: true, message: 'Posts get Successfully', data: posts});
    }

    catch (err){
        return res.json({success: false, message: err.message});
    }
}


module.exports = router;