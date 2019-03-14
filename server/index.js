const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const monk = require('monk');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const request = require('request');

require('dotenv').config();

const app = express();
const db = monk(process.env.DB); // 127.0.0.1/notumclo or mongodb URI
const posts = db.get('posts');
const secret = process.env.SECRET; // A long, random string
const saltRounds = 10;
const upload = multer({ dest: '/server' });
const users = db.get('users');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!');
};

app.use(
  cors({
    origin: ['http://127.0.0.1:8080', 'https://notumclo.glitch.me'],
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use('/img', express.static('img'));

app.get('/', (req, res) => {
  res.json({ message: 'notumclo' });
});

app.get('/dashboard', (req, res) => {
  const token = req.cookies.token;
  posts.find().then(posts => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'User not authorized' });
      res.json(posts);
    });
  });
});

app.get('/posts', (req, res) => {
  const token = req.cookies.token;
  posts.find().then(posts => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'User not authorized' });
      res.json(posts);
    });
  });
});

app.post('/username', (req, res) => {
  let user = '';
  req.on('data', chunk => {
    user += chunk.toString();
  });
  req.on('end', () => {
    posts.findOne({ creatorID: user }).then(results => {
      res.send(results.creator);
    });
  });
});

app.get('/users', (req, res) => {
  users.find().then(posts => {
    res.json(posts);
  });
});

app.get('/spotify', (req, res) => {
  const Headers = {
    Authorization: 'Basic ' + process.env.SPOTIFY, // <base64 encoded client_id:client_secret> More info here: https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
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

function isValidLoginRequest(LoginRequest) {
  return (
    LoginRequest.usermail &&
    LoginRequest.password &&
    LoginRequest.type &&
    LoginRequest.usermail.toString().trim() !== '' &&
    LoginRequest.password.toString().trim() !== '' &&
    (LoginRequest.type.toString() === 'email' ||
      LoginRequest.type.toString() === 'username')
  );
}

function isValidPost(post) {
  if (post.type === 'text')
    return (
      post.TextTitle &&
      post.TextContent &&
      post.TextTags &&
      post.TextTitle.toString().trim() !== '' &&
      post.TextContent.toString().trim() !== '' &&
      post.TextTags.toString().trim() !== ''
    );
  else if (post.type === 'image')
    return (
      post.ImgURL &&
      post.ImageCaption &&
      post.ImageTags &&
      post.ImgURL.toString().trim() !== '' &&
      post.ImageCaption.toString().trim() !== '' &&
      post.ImageTags.toString().trim() !== ''
    );
  else if (post.type === 'quote')
    return (
      post.QuoteContent &&
      post.QuoteSource &&
      post.QuoteTags &&
      post.QuoteContent.toString().trim() !== '' &&
      post.QuoteSource.toString().trim() !== '' &&
      post.QuoteTags.toString().trim() !== ''
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

function isValidRegRequest(regRequest) {
  return (
    regRequest.Username &&
    regRequest.Email &&
    regRequest.Password &&
    regRequest.Username.toString().trim() &&
    regRequest.Email.toString().trim() &&
    regRequest.Password.toString().trim()
  );
}

function parsePost(post, id, username) {
  if (post.type === 'text')
    return {
      title: post.TextTitle.toString(),
      content: post.TextContent.toString(),
      tags: post.TextTags.toString(),
      type: 'text',
      created: new Date(),
      creatorID: id,
      creator: username
    };
  else if (post.type === 'image')
    return {
      file: post.ImgURL.toString(),
      caption: post.ImageCaption.toString(),
      tags: post.ImageTags.toString(),
      type: 'image',
      created: new Date(),
      creatorID: id,
      creator: username
    };
  else if (post.type === 'quote')
    return {
      content: post.QuoteContent.toString(),
      source: post.QuoteSource.toString(),
      tags: post.QuoteTags.toString(),
      type: 'quote',
      created: new Date(),
      creatorID: id,
      creator: username
    };
  else if (post.type === 'audio')
    return {
      source: post.PlayButtonSrc.toString(),
      description: post.AudioDescription.toString(),
      tags: post.AudioTags.toString(),
      type: 'audio',
      created: new Date(),
      creatorID: id,
      creator: username
    };
  else if (post.type === 'video')
    return {
      source: post.URL.toString(),
      description: post.VideoDescription.toString(),
      tags: post.VideoTags.toString(),
      type: 'video',
      created: new Date(),
      creatorID: id,
      creator: username
    };
  else if (post.type === 'chat')
    return {
      content: post.ChatContent.toString(),
      tags: post.ChatTags.toString(),
      type: 'chat',
      created: new Date(),
      creatorID: id,
      creator: username
    };
}

app.post('/img', upload.single('file'), (req, res) => {
  const Fname = Date.now() + path.extname(req.file.originalname).toLowerCase();
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, '/img/', Fname);

  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);

    res
      .status(200)
      .contentType('text/plain')
      .end(Fname);
  });
});

app.post('/login', (req, res) => {
  if (isValidLoginRequest(req.body)) {
    const usermail = req.body.usermail.toString();
    const password = req.body.password.toString();
    const type = req.body.type.toString();

    if (type === 'email') {
      users.find({ email: usermail }).then(results => {
        if (results.length === 0) {
          res.status(401);
          res.json({ message: 'Email not found' });
        }
        bcrypt.compare(password, results[0].password, (err, same) => {
          if (same) {
            const token = jwt.sign({ id: results[0]._id }, secret, {
              expiresIn: 604800000
            });
            res.cookie('token', token, { maxAge: 604800000, httpOnly: false });
            res.status(200).send(token);
          } else {
            res.status(401);
            res.json({ message: 'Incorrect Password' });
          }
        });
      });
    } else {
      users.find({ username: usermail }).then(results => {
        if (results.length === 0) {
          res.status(401);
          res.json({ message: 'Username not found' });
        }
        bcrypt.compare(password, results[0].password, (err, same) => {
          if (same) {
            const token = jwt.sign({ id: results[0]._id }, secret, {
              expiresIn: 604800000
            });
            res.cookie('token', token, { maxAge: 604800000, httpOnly: false });
            res.status(200).send(token);
          } else {
            res.status(401);
            res.json({ message: 'Incorrect Password' });
          }
        });
      });
    }
  }
});

app.post('/registration', (req, res) => {
  if (isValidRegRequest(req.body)) {
    const username = req.body.Username.toString();
    const email = req.body.Email.toString();
    const password = req.body.Password.toString();

    users.find({ username: username }).then(results => {
      if (results.length > 0) {
        res.status(409);
        res.json({ message: 'An account with this username already exists' });
      }
    });

    users.find({ email: email }).then(results => {
      if (results.length > 0) {
        res.status(409);
        res.json({ message: 'An account with this email already exists' });
      }
    });

    bcrypt.hash(password, saltRounds, (err, hash) => {
      users.insert({ username, email, password: hash }).then(createdUser => {
        const userId = createdUser._id;
        const token = jwt.sign({ id: userId }, secret, {
          expiresIn: 604800000
        });
        res.cookie('token', token, { maxAge: 604800000, httpOnly: false });
        res.status(200).send(token);
      });
    });
  } else {
    res.status(422);
    res.json({ message: 'Invalid request' });
  }
});

app.post('/tag', (req, res) => {
  let body = '#(';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    body += ')(\\b|$)';
    const regex = new RegExp(body, 'i');
    posts.find({ tags: { $regex: regex } }).then(posts => {
      res.json(posts);
    });
  });
});

app.post('/user', (req, res) => {
  let user = '';
  req.on('data', chunk => {
    user += chunk.toString();
  });
  req.on('end', () => {
    posts.find({ creatorID: user }).then(posts => {
      res.json(posts);
    });
  });
});

app.use(rateLimit({ windowMs: 600000, max: 20 }));

app.post('/posts', (req, res) => {
  const token = req.cookies.token;
  if (isValidPost(req.body)) {
    let userID;
    let username;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbiden' });
      userID = decoded.id;
      users.find({ _id: userID }).then(results => {
        username = results[0].username;
        const post = parsePost(req.body, userID, username);
        posts.insert(post).then(createdPost => {
          res.json(createdPost);
        });
      });
    });
  } else {
    res.status(422);
    res.json({ message: 'Invalid post' });
  }
});
