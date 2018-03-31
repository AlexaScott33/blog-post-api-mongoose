'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//I exported this from server.js so why do I need it here ??
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const BlogPost = require('../models/blog');

//ENDPOINTS - see requirements for each

//get All
router.get('/posts', (req, res) => {
  BlogPost.find()
    .then(blogs => {
      res.json({
        blogs: blogs.map(blog => blog.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//get by id
router.get('/posts/:id', (req, res) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
  }

  BlogPost.findById(id)
    .then(blog => {
      res.json({
        blog: blog.serialize()
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//create new blog
// router.post('/posts', (req, res) => {
//   //const {title, content, author} = req.body;

// //   const requiredFields = ['title', 'content', 'author'];
// //   for(let i = 0; i < requiredFields.length; i++) {
// //     const field = requiredFields[i];
// //     if(!(field in req.body)) {
// //       const message = `Missing ${field} in request body`;
// //       console.error(message);
// //       return res.status(400).send(message);
// //     }
// //   }

//   //const newBlog = {title, content, author};

//   BlogPost.create({
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author
//   })
//     .then(blog => res.status(201).json(blog.serialize()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     });
// });

router.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  
  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
  
});
  

module.exports = router;
