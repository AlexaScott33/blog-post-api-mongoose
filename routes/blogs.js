'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

router.use(bodyParser.json());

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


router.post('/posts', (req, res) => {
  //console.log(req.body);

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

router.put('/posts/:id', (req, res) => {
  //const {id} = req.params;
  //const {title, content, author} = req.body;

  if(!req.body.id) {
    const err = new Error('Missing `id` in request body');
    console.error(err);
    err.status = 400; 
  }

  if(req.params.id !== req.body.id) {
    const err = new Error(`The ${req.params.id} and ${req.body.id} must match.`);
    console.error(err);
    err.status = 400;
  }
  const toUpdate = {};
  const updatedBlog = ['title', 'content', 'author'];
  updatedBlog.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPost.findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(result => res.status(200).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;

  BlogPost.findByIdAndRemove(id)
    .then(() => {
      console.log(`Deleted blog post with id \`${id}\``);
      res.status(204).end();
    });
});

module.exports = router;
