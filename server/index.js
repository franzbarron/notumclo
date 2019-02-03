const cors = require('cors');
const express = require('express');
const monk = require('monk');
const rateLimit = require('express-rate-limit');

const app = express();
const db = monk(process.env.SECRET || '127.0.0.1/notumclo');
const posts = db.get('posts');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: 'notumclo'});
});

app.get('/posts', (req, res) => {
  posts.find().then(posts => {
    res.json(posts);
  });
})

app.listen(5000, () => {
  console.log('Listening on http://127.0.0.1:5000');
});

function isValidPost(post) {
  if (post.type === 'text')
    return post.textTitle && post.textContent && post.textTags &&
        post.textTitle.toString().trim() !== '' &&
        post.textContent.toString().trim() !== '' &&
        post.textTags.toString().trim() !== '';
  else if (post.type === 'image')
    return post.imageFile && post.imageCaption && post.imageTags &&
        post.imageCaption.toString().trim() !== '' &&
        post.imageTags.toString().trim() !== '';
}

function parsePost(post) {
  if (post.type === 'text')
    return {
      title: post.textTitle.toString(),
      content: post.textContent.toString(),
      tags: post.textTags.toString(),
      type: 'text',
      created: new Date()
    };
  else if (post.type === 'image')
    return {
      file: post.imageFile,
      caption: post.imageCaption.toString(),
      tags: post.imageTags.toString(),
      type: 'image',
      created: new Date()
    };
}

app.use(rateLimit({windowMs: 10 * 60 * 1000, max: 6}));

app.post('/posts', (req, res) => {
  if (isValidPost(req.body)) {
    const post = parsePost(req.body);
    posts.insert(post).then(createdPost => {
      res.json(createdPost);
    });
  } else {
    res.status(422);
    res.json({message: 'Invalid post'});
  }
});