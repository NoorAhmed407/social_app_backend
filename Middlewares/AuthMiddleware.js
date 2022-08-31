const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = authMiddleware;


 async function authMiddleware(req,res,next){
     let token = req.header('Authorization')?.split('Bearer ')[1];
     if(!token){
         return res.status(401).json({"message": "Unauthorized!"});
     }
     try{
        const decode = jwt.verify(token, process.env.SALT_KEY);
        req.user = decode;
        next();
     }
     catch(e){
         return res.status(400).json({success: false, message: "Invalid Token"});
     }
 } 