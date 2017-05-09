const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const {
    BlogPosts
} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

BlogPosts.create(
    ["id": "uuid.v4",
    "title": "First Entry",
     "content": "The content of the blog goes here",
     "author": "Person Name",
'publishDate': publishDate || Date.now()]
)


app.get('/blog-posts', (req, res) => {
    res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
    const requiredFields = ["id", "title", "content", "author", "publishDate"];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = BlogPosts.create(
        req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});


app.put('/blog-posts/:id', jsonParser(req, res) => {
    const requiredFields = ["id", "title", "content", "author", "publishDate"];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id`
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        pushlishDate: req.body.publishDate
    });
    res.status(204).json(updatedItem);
});


app.delete('/blog-posts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post with id \`${req.params.id}\``);
    res.status(204).end();
});


app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on('error', err => {
                reject(err);
            });
    });
}

//... closeServer defined here

if (require.main === module) {
    runServer().catch(err => console.error(err));
};
