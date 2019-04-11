const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const monk = require('monk');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const db = monk(process.env.DB); // 127.0.0.1/notumclo or mongodb URI
const posts = db.get('posts');
const secret = process.env.SECRET; // A long, random string
const saltRounds = 10;
const upload = multer({ dest: '/server' });
const users = db.get('users');

// posts.remove();
// users.remove();

const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!');
};

app.use(
  cors({
    origin: ['http://127.0.0.1:8080', 'https://notumclo.glitch.me'], // list of allowed origins
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

app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, secret, (err, decoded) => {
    res.json(decoded.id);
  });
});

app.get('/posts', (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'User not authorized' });
    else {
      posts
        .aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'creatorID',
              foreignField: '_id',
              as: 'creatorData'
            }
          },
          {
            $project: {
              creatorData: {
                password: 0,
                email: 0,
                _id: 0
              }
            }
          },
          { $sort: { created: -1 } }
        ])
        .then(results => {
          res.json(results);
        });
      // posts.find().then(posts => {
      //   res.json(posts);
      // });
    }
  });
});

app.get('/users', (req, res) => {
  users.find().then(posts => {
    res.json(posts);
  });
});

app.get('/spotify', (req, res) => {
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: 'Basic ' + process.env.SPOTIFY, // <base64 encoded client_id:client_secret> More info here: https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(response => response.json())
    .then(response => {
      res.json(response);
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
    regRequest.Email &&
    regRequest.Name &&
    regRequest.Password &&
    regRequest.Username &&
    regRequest.Email.toString().trim() &&
    regRequest.Name.toString().trim() &&
    regRequest.Password.toString().trim() &&
    regRequest.Username.toString().trim()
  );
}

function parsePost(post, id, username) {
  if (post.type === 'text')
    return {
      content: post.TextContent.toString(),
      created: new Date(),
      creatorID: monk.id(id),
      tags: post.TextTags.toString(),
      title: post.TextTitle.toString(),
      type: 'text'
    };
  else if (post.type === 'image')
    return {
      caption: post.ImageCaption.toString(),
      created: new Date(),
      creatorID: monk.id(id),
      file: post.ImgURL.toString(),
      tags: post.ImageTags.toString(),
      type: 'image'
    };
  else if (post.type === 'quote')
    return {
      content: post.QuoteContent.toString(),
      created: new Date(),
      creatorID: monk.id(id),
      source: post.QuoteSource.toString(),
      tags: post.QuoteTags.toString(),
      type: 'quote'
    };
  else if (post.type === 'audio')
    return {
      created: new Date(),
      creatorID: monk.id(id),
      description: post.AudioDescription.toString(),
      source: post.PlayButtonSrc.toString(),
      tags: post.AudioTags.toString(),
      type: 'audio'
    };
  else if (post.type === 'video')
    return {
      created: new Date(),
      creatorID: monk.id(id),
      description: post.VideoDescription.toString(),
      source: post.URL.toString(),
      tags: post.VideoTags.toString(),
      type: 'video'
    };
  else if (post.type === 'chat')
    return {
      content: post.ChatContent.toString(),
      created: new Date(),
      creatorID: monk.id(id),
      tags: post.ChatTags.toString(),
      type: 'chat'
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
    const usermail = req.body.usermail.toString().toLowerCase();
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
    const email = req.body.Email.toString().toLowerCase();
    const name = req.body.Name.toString();
    const password = req.body.Password.toString();
    const username = req.body.Username.toString().toLowerCase();

    users.find({ username: username }).then(results => {
      if (results.length > 0) {
        res.status(409);
        res.json({ message: 'An account with this username already exists' });
      } else {
        users.find({ email: email }).then(results => {
          if (results.length > 0) {
            res.status(409);
            res.json({ message: 'An account with this email already exists' });
          } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
              users
                .insert({ email, name, username, password: hash })
                .then(createdUser => {
                  const userId = createdUser._id;
                  const token = jwt.sign({ id: userId }, secret, {
                    expiresIn: 604800000
                  });
                  res.cookie('token', token, {
                    maxAge: 604800000,
                    httpOnly: false
                  });
                  res.status(200).send(token);
                });
            });
          }
        });
      }
    });
  } else {
    res.status(422);
    res.json({ message: 'Invalid request' });
  }
});

app.post('/search/all', (req, res) => {
  const QueryRegex = new RegExp(req.body.query.toString(), 'i');

  users.find({ username: { $regex: QueryRegex } }).then(results => {
    let userIDs = [];
    results.forEach(result => {
      userIDs.push(monk.id(result._id));
    });
    posts
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'creatorID',
            foreignField: '_id',
            as: 'creatorData'
          }
        },
        {
          $match: {
            $or: [
              { caption: { $regex: QueryRegex } },
              { content: { $regex: QueryRegex } },
              { creatorID: { $in: userIDs } },
              { description: { $regex: QueryRegex } },
              { source: { $regex: QueryRegex } },
              { tags: { $regex: QueryRegex } },
              { title: { $regex: QueryRegex } }
            ]
          }
        },
        {
          $project: {
            creatorData: {
              password: 0,
              email: 0,
              _id: 0
            }
          }
        },
        { $sort: { created: -1 } }
      ])
      .then(results => {
        res.json(results);
      });
  });
});

app.post('/search/people', (req, res) => {
  const QueryRegex = new RegExp(req.body.query.toString(), 'i');
  users
    .find({
      $or: [
        { name: { $regex: QueryRegex } },
        { username: { $regex: QueryRegex } }
      ]
    })
    .then(queryResults => {
      res.json(queryResults);
    });
});

app.post('/update', (req, res) => {
  let update = {};
  update[req.body.field] = req.body.value;

  if (req.body.field === 'username' || req.body.field === 'email') {
    users.find(update).then(result => {
      if (result.length > 0) {
        res.status(409);
        res.json({
          message: 'An account with this ' + req.body.field + ' already exists'
        });
      } else {
        users.update({ _id: monk.id(req.body.id) }, { $set: update });

        res.status(200).json({ message: 'User updated successfully' });
      }
    });
  } else {
    users.update({ _id: monk.id(req.body.id) }, { $set: update });

    res.status(200).json({ message: 'user updated successfully' });
  }
});

app.post('/update-password', (req, res) => {
  users.findOne(req.body.id).then(result => {
    bcrypt.compare(req.body.current, result.password, (err, same) => {
      if (same) {
        bcrypt.hash(req.body.new, saltRounds, (err, hash) => {
          users.update(
            { _id: monk.id(req.body.id) },
            { $set: { password: hash } }
          );

          res.status(200).json({ message: 'success' });
        });
      } else {
        res.status(401).json({ message: 'Incorrect Password' });
      }
    });
  });
});

app.post('/user', (req, res) => {
  let user = '';
  req.on('data', chunk => {
    user += chunk.toString();
  });
  req.on('end', () => {
    const id = monk.id(user);
    posts.find({ creatorID: id }, { sort: { created: -1 } }).then(posts => {
      res.json(posts);
    });
  });
});

app.post('/user-data', (req, res) => {
  let user = '';
  req.on('data', chunk => {
    user += chunk.toString();
  });
  req.on('end', () => {
    users.findOne({ _id: user }).then(results => {
      res.send(results);
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
