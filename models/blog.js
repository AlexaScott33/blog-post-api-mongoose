'use strict';

const mongoose = require('mongoose');

// this is our schema to represent a blog
//do i need new?
const blogSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String},
  created: { type: Date, default: Date.now }
});

blogSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
});

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.authorName,
    content: this.content,
    created: this.created
  };
};

module.exports = mongoose.model('Blog', blogSchema);

