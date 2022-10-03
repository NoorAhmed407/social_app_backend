const express = require('express');
const router = express.Router();
const Post = require('../Models/Posts');
const multer = require('multer');
const authMiddleware = require('./../Middlewares/AuthMiddleware');




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });


router.get('/', authMiddleware, getPosts);
router.post('/add', [authMiddleware, upload.single('image')], addPost);
router.post('/edit', authMiddleware, editPost);
router.post('/delete', authMiddleware, deletePost);

//AddPost
async function addPost(req,res){
    const {title,description,postedBy} = req.body;
    console.log("req.body", req.body)

    
    try{
        if(!title || !description){
            console.log("req.body", req.body)
            return res.status(400).json({success: false, message: 'Title and description is required'});
        }
    
        if(!postedBy){
            return res.status(400).json({success: false, message: 'User id is missing'});
        }
        
        var image = '';
        
        if(req.file){
            image = req.file.path;
        }
        
        let post = await Post.create({
            title,
            description,
            postedBy,
            image
        });
    
        if(post){
            return res.status(200).json({success: true, data: post, message: 'Post Added Successfully'});
        }
        else{
            return res.status(400).json({success: false,  message: 'Something Went Wrong'});
        }    
    }

    catch(err){
        return res.status(500).json({success: false, message: err.message});

    }




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
        const posts = await Post.find({}).populate({path: 'postedBy', select: '-password -__v'});
        return res.json({success: true, message: 'Posts get Successfully', data: posts});
    }

    catch (err){
        return res.json({success: false, message: err.message});
    }
}


module.exports = router;