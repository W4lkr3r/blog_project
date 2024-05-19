const express =require('express');
const cors=require('cors');
const { default: mongoose, Schema } = require('mongoose');
const User=require('./models/User');
const Post=require('./models/Post');
const bcrypt= require('bcryptjs'); // bcrypt is used to encoide the password which is been saved in the data base
const app=express();
 const jwt=require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const multer =require('multer');// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const uploadMiddleware=multer({dest: 'uploads/' });
const fs =require('fs');
const salt = bcrypt.genSaltSync(10);


const secret='njsanxcsidncsnsji';
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
// for parsinng the request from the json we will use another middle ware that uis been called as the express.json

app.use('/uploads',express.static(__dirname+ '/uploads'));

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


app.post('/post',uploadMiddleware.single('file'),async  (req,res)=>{
   //saved file type is binary
    const {originalname,path}=req.file;
    const parts= originalname.split('.');
   
    const extension= parts[parts.length-1]; 
    const newPath=path+'.'+extension;
    fs.renameSync(path,newPath);


    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
      if(err) throw err;
 const{title,summary,content}=req.body;
 const postDoc= await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author: info.id,
  });
   res.json(postDoc);

   });
});




   
     
   // here there was a mistake we will write file not files
  
   

app.get('/post',async(req,res)=>{
 res.json(await Post.find()
 .populate('author',['username'])
 .sort({createdAt:-1})
 .limit(20)

);
});



app.get('/post/:id',async(req,res)=>{
   const {id}=req.params;

   const postDoc= await Post.findById(id).populate('author',['username']);
   res.json(postDoc);
})


app.put('/post',uploadMiddleware.single('file'),async(req,res)=>{
   let newPath=null;
   if(req.file){
      const {originalname,path}=req.file;
      const parts= originalname.split('.');
     
      const extension= parts[parts.length-1]; 
       newPath=path+'.'+extension;
      fs.renameSync(path,newPath);
  
   }
   const {token}=req.cookies;
   jwt.verify(token,secret,{},async(err,info)=>{
      if(err) throw err;
 const{id,title,summary,content}=req.body;
      const postDoc=await Post.findById(id);
      const isAuthor= JSON.stringify(postDoc.author)=== JSON.stringify(info.id);

      if(!isAuthor){
         return res.json(400).json('YOU ARE NOT THE AUTHOR');
         
      }
      await postDoc.updateOne({
         title,
         summary,
         content,
         cover: newPath? newPath: postDoc.cover,
      });

   res.json(postDoc);


}) ;
});

app.listen(4000);  