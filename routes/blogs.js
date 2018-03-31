'use strict';

const express = require('express');
const router = express.Router();

//i exported this from server.js so why do in need it here ??
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//const { BlogPost } = require('./models/blog);

//ENDPOINTS - see requirements for each





module.exports = router;
