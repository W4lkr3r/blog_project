const express =require('express');
const cors=require('cors');
const { default: mongoose } = require('mongoose');
const User=require('./models/User');
const bcrypt= require('bcryptjs'); // bcrypt is used to encoide the password which is been saved in the data base
const app=express();
 const jwt=require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const multer =require('multer');// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const uploadMiddleware=multer({dest:'uploads/'});
const salt = bcrypt.genSaltSync(10);


const secret='njsanxcsidncsnsji';
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
// for parsinng the request from the json we will use another middle ware that uis been called as the express.json



 mongoose.connect('mongodb://localhost:27017');
app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    try{
 const userDoc=  await User.create({username,
    password:bcrypt.hashSync(password,salt)});
   res.json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
    }
});

app.post('/login',async (req,res)=>{
    const { username,password}=req.body;
   const userDoc=await User.findOne({username});

// comparing the  the password with the one in the databse use use the below funcion
   const passOk= bcrypt.compareSync(password,userDoc.password)
   if(passOk){
     // logged in 
     jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
        if(err) throw err;
        res.cookie('token',token).json({
         if:userDoc._id,
         username,
        });
   })
   }
   else{
    res.status(400).json('wrong credentials');
   }
});

app.get('/profile',(req,res)=>{
   const {token}=req.cookies;
   jwt.verify(token,secret,{},(err,info)=>{
      if(err) throw err;
      res.json(info);
   });
  
});  


app.post('/logout',(req,res)=>{
   res.cookie('token','').json('ok');
});


app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
   //saved file type is binary
    await res.json({files:req.file}); // here there was a mistake we will write file not files

});

app.listen(4000);  