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



module.exports = router;
