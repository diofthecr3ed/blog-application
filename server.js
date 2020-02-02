const mongoose = require('mongoose');
const express = require('express');
const Post = require('./postModel')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
 
const server = express()
server.set('view engine', 'ejs')
server.use(express.json())
server.use(express.static(__dirname+'/public'));
server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())

mongoose
    .connect('mongodb://localhost:27017/blog_application', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,

    })
    .then(() => {
        console.log(`DB Connection successful`);
    });


    server.get('/posts',async(req,res)=>{
           
                const posts = await Post.find();
                res.render('index',{
                    posts:posts,
                   title:"Posts page"

                })
           
    }) 

    server.get('/post',async(req,res)=>{
           
        const post = await Post.findById(req.query.id);
        if(!post){
            return res.status(200).json({
                status: 'failed',
                message: 'No post found.'
            });
        }
        res.render('content',{
            post:post,
           title:post.title

        })
   
})


server.get('/form',async(req,res)=>{
           
    res.render('form',{

       title:'post article'

    })

})

    server.patch('/post/:id',async(req,res)=>{
        if(req.body.Like){
            const like =( await Post.findById(req.params.id)).likes;

            req.body.likes = like+1;
        }

        const post = await Post.findByIdAndUpdate(req.params.id , req.body ,{
            runValidators: true,
            new: true
        });
        if(!post){
            return res.status(200).json({
                status: 'failed',
                message: 'No post found.'
            });
        }
        console.log('working')

        res.status(200).json({
            status: 'success',
            data: post
        });

    });

    server.post('/post',async(req,res)=>{
        console.log(req.body)
        const post = await Post.create(req.body);
        res.status(201).json({
            status: 'success',
         post
        });
    });

    server.delete('/post/:id',async(req,res)=>{
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
         return   res.status(200).json({
                status: 'failed',
                message: 'No post found.'
            });
        }
        res.status(204).json({
            status: 'success',
            data: post
        });

    });


server.get('/about',(req,res)=>{
    res.render('about')
})

server.listen(3000, '127.0.0.1', ()=>{
    console.log('Server listening on port 8002')
})