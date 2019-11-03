const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    body: String
});

const Blog = mongoose.model('blogposts', blogSchema);

module.exports = Blog;