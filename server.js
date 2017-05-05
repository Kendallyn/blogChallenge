const express = require('express');
const bodyParser = require('body-parser');

const {
    BlogPosts
} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.get('/', (req, res) => {
    res.json(BlogPosts.get());
});
