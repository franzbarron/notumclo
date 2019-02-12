const cors = require('cors');
const express = require('express');
const fs = require('fs');
const monk = require('monk');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const request = require('request');

const app = express();
const db = monk(process.env.SECRET || '127.0.0.1/notumclo');
const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!');
};
const posts = db.get('posts');
const upload = multer({ dest: '/server' });

app.use(cors());
app.use(express.json());
app.use('/img', express.static('img'));

app.get('/', (req, res) => {
  res.json({ message: 'notumclo' });
});

app.get('/posts', (req, res) => {
  posts.find().then(posts => {
    res.json(posts);
  });
});

app.get('/spotify', (req, res) => {
  const Headers = {
    Authorization:
      'Basic NzEwMmNjY2IyYjMxNDkwNmI0NmIyZGUwMjY4OGVlYmE6YzQyMjQ4N2VjNTkxNGZhMDk1YTQ5NjhkZmI3ZDkzMDE=',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const DataString = 'grant_type=client_credentials';
  const Options = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: Headers,
    body: DataString
  };

  request(Options, (error, response, body) => {
    if (!error && response.statusCode === 200) res.json(JSON.parse(body));
  });
});

app.listen(5000, () => {
  console.log('Listening on http://127.0.0.1:5000');
});

function isValidPost(post) {
  if (post.type === 'text')
    return (
      post.textTitle &&
      post.textContent &&
      post.textTags &&
      post.textTitle.toString().trim() !== '' &&
      post.textContent.toString().trim() !== '' &&
      post.textTags.toString().trim() !== ''
    );
  else if (post.type === 'image')
    return (
      post.ImgURL &&
      post.imageCaption &&
      post.imageTags &&
      post.ImgURL.toString().trim() !== '' &&
      post.imageCaption.toString().trim() !== '' &&
      post.imageTags.toString().trim() !== ''
    );
  else if (post.type === 'quote')
    return (
      post.quoteContent &&
      post.quoteSource &&
      post.quoteTags &&
      post.quoteContent.toString().trim() !== '' &&
      post.quoteSource.toString().trim() !== '' &&
      post.quoteTags.toString().trim() !== ''
    );
  else if (post.type === 'audio')
    return (
      post.PlayButtonSrc &&
      post.AudioDescription &&
      post.AudioTags &&
      post.AudioDescription.toString().trim() !== '' &&
      post.AudioTags.toString().trim() !== ''
    );
  else if (post.type === 'video')
    return (
      post.URL &&
      post.VideoDescription &&
      post.VideoTags &&
      post.VideoDescription.toString().trim() !== '' &&
      post.VideoTags.toString().trim() !== ''
    );
  else if (post.type === 'chat')
    return (
      post.ChatContent &&
      post.ChatTags &&
      post.ChatContent.toString().trim() !== '' &&
      post.ChatTags.toString().trim() !== ''
    );
  else return false;
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
      file: post.ImgURL.toString(),
      caption: post.imageCaption.toString(),
      tags: post.imageTags.toString(),
      type: 'image',
      created: new Date()
    };
  else if (post.type === 'quote')
    return {
      content: post.quoteContent.toString(),
      source: post.quoteSource.toString(),
      tags: post.quoteTags.toString(),
      type: 'quote',
      created: new Date()
    };
  else if (post.type === 'audio')
    return {
      source: post.PlayButtonSrc.toString(),
      description: post.AudioDescription.toString(),
      tags: post.AudioTags.toString(),
      type: 'audio',
      created: new Date()
    };
  else if (post.type === 'video')
    return {
      source: post.URL.toString(),
      description: post.VideoDescription.toString(),
      tags: post.VideoTags.toString(),
      type: 'video',
      created: new Date()
    };
  else if (post.type === 'chat')
    return {
      content: post.ChatContent.toString(),
      tags: post.ChatTags.toString(),
      type: 'chat',
      created: new Date()
    };
}

app.post('/img', upload.single('file'), (req, res) => {
  const Fname = Date.now() + path.extname(req.file.originalname).toLowerCase();
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, '/img/' + Fname);

  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);

    res
      .status(200)
      .contentType('text/plain')
      .end(Fname);
  });
});

app.post('/tag', (req, res) => {
  let body = '(#';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    body += ')';
    const regex = new RegExp(body, 'i');
    posts.find({ tags: { $regex: regex } }).then(posts => {
      res.json(posts);
    });
  });
});

app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 6 }));

app.post('/posts', (req, res) => {
  if (isValidPost(req.body)) {
    const post = parsePost(req.body);
    posts.insert(post).then(createdPost => {
      res.json(createdPost);
    });
  } else {
    res.status(422);
    res.json({ message: 'Invalid post' });
  }
});
