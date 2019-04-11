const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/'
    : 'https://notumclo-api.glitch.me/';
const POSTS_URL = API_URL + 'posts';
const IMG_URL = API_URL + 'img/';

const CancelButtons = document.querySelectorAll('.btn-cancel');
const ErrorAlert = document.querySelector('#error-alert');
const NewPosts = document.querySelector('#new-posts');
const PostsFeed = document.querySelector('#posts-feed');

let PostsLength = 0;
let PostOptions =
  window.innerWidth < 576
    ? document.querySelector('#post-options-small')
    : document.querySelector('#post-options-large');

listAllPosts();

setInterval(() => {
  fetchPosts().then(posts => {
    const Difference = posts.length - PostsLength;
    if (Difference !== 0) {
      NewPosts.textContent =
        Difference === 1 ? '1 New Post' : Difference + ' New Posts';
      NewPosts.style.display = '';
    }
  });
}, 60000);

window.onresize = () => {
  PostOptions =
    window.innerWidth < 576
      ? document.querySelector('#post-options-small')
      : document.querySelector('#post-options-large');
};

NewPosts.onclick = event => {
  event.stopImmediatePropagation();
  listAllPosts();
  NewPosts.style.display = 'none';
};

async function fetchPosts() {
  let posts;

  await fetch(POSTS_URL, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => {
      if (response.status === 403) window.location.href = 'login.html';
      else return response.json();
    })
    .then(response => {
      posts = response;
    });

  return new Promise((resolve, reject) => {
    resolve(posts);
  });
}

function listAllPosts() {
  while (PostsFeed.firstChild) PostsFeed.removeChild(PostsFeed.firstChild);
  fetchPosts()
    .then(posts => {
      PostsLength = posts.length;
      if (PostsLength === 0) {
        const Div = document.createElement('div');
        Div.classList.add('card');
        const CardBody = document.createElement('div');
        CardBody.classList.add('card-body');

        const Txt = document.createElement('p');
        Txt.classList.add('card-text');
        Txt.textContent = 'No posts available';

        CardBody.appendChild(Txt);
        Div.appendChild(CardBody);
        PostsFeed.appendChild(Div);
      } else {
        posts.forEach(post => {
          if (post.type === 'text') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardHeader = document.createElement('div');
            CardHeader.classList.add('card-header');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

            const UserHeader = document.createElement('h5');
            const UserLink = document.createElement('a');
            UserLink.classList.add('user-link');
            UserLink.setAttribute('href', 'user.html?id=' + post.creatorID);
            UserLink.textContent = post.creatorData[0].username;
            UserHeader.appendChild(UserLink);

            const CardTitle = document.createElement('h3');
            CardTitle.classList.add('card-title');
            CardTitle.textContent = post.title;
            const CardText = document.createElement('p');
            CardText.classList.add('card-text');
            CardText.textContent = post.content;

            const Tags = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const TagLink = document.createElement('a');
              TagLink.setAttribute('href', '/search.html?q=%23' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag + ' ';
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardHeader.appendChild(UserHeader);
            CardBody.appendChild(CardTitle);
            CardBody.appendChild(CardText);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardHeader);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'image') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardHeader = document.createElement('div');
            CardHeader.classList.add('card-header');
            Card.classList.add('img-fluid');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

            const UserHeader = document.createElement('h5');
            const UserLink = document.createElement('a');
            UserLink.classList.add('user-link');
            UserLink.setAttribute('href', 'user.html?id=' + post.creatorID);
            UserLink.textContent = post.creatorData[0].username
            UserHeader.appendChild(UserLink);

            const CardImg = new Image();
            CardImg.src = post.file;
            CardImg.classList.add('card-img-top');

            const CardText = document.createElement('p');
            CardText.classList.add('card-text');
            CardText.setAttribute('style', 'white-space: pre-line;');
            CardText.textContent = post.caption;

            const Tags = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const TagLink = document.createElement('a');
              TagLink.setAttribute('href', '/search.html?q=%23' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag + ' ';
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardHeader.appendChild(UserHeader);
            CardBody.appendChild(CardText);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardHeader);
            Card.appendChild(CardImg);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'quote') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardHeader = document.createElement('div');
            CardHeader.classList.add('card-header');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

            const UserHeader = document.createElement('h5');
            const UserLink = document.createElement('a');
            UserLink.classList.add('user-link');
            UserLink.setAttribute('href', 'user.html?id=' + post.creatorID);
            UserLink.textContent = post.creatorData[0].username;
            UserHeader.appendChild(UserLink);

            const Blockquote = document.createElement('blockquote');
            const QuoteP = document.createElement('p');
            QuoteP.classList.add('mb-0');
            QuoteP.setAttribute('style', 'white-space: pre-line;');
            QuoteP.textContent = post.content;
            const BlockquoteFooter = document.createElement('footer');
            BlockquoteFooter.classList.add('blockquote-footer');
            BlockquoteFooter.textContent = post.source;
            Blockquote.appendChild(QuoteP);
            Blockquote.appendChild(BlockquoteFooter);

            const Tags = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const TagLink = document.createElement('a');
              TagLink.setAttribute('href', '/search.html?q=%23' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag;
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardHeader.appendChild(UserHeader);
            CardBody.appendChild(Blockquote);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardHeader);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'audio') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardHeader = document.createElement('div');
            CardHeader.classList.add('card-header');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

            const UserHeader = document.createElement('h5');
            const UserLink = document.createElement('a');
            UserLink.classList.add('user-link');
            UserLink.setAttribute('href', 'user.html?id=' + post.creatorID);
            UserLink.textContent = post.creatorData[0].username;
            UserHeader.appendChild(UserLink);

            const FrameContainer = document.createElement('div');
            FrameContainer.classList.add('embed-responsive');
            FrameContainer.classList.add('embed-responsive-1by1');
            const SpotifyFrame = document.createElement('iframe');
            SpotifyFrame.classList.add('embed-responsive-item');
            SpotifyFrame.setAttribute('allow', 'encrypted-media');
            SpotifyFrame.setAttribute('allowtransparency', 'true');
            SpotifyFrame.setAttribute('src', post.source);
            FrameContainer.appendChild(SpotifyFrame);
            const Description = document.createElement('p');
            Description.textContent = post.description;

            const Tags = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const TagLink = document.createElement('a');
              TagLink.setAttribute('href', '/search.html?q=%23' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag;
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardHeader.appendChild(UserHeader);
            CardBody.appendChild(FrameContainer);
            CardBody.appendChild(Description);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardHeader);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'video') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardHeader = document.createElement('div');
            CardHeader.classList.add('card-header');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

            const UserHeader = document.createElement('h5');
            const UserLink = document.createElement('a');
            UserLink.classList.add('user-link');
            UserLink.setAttribute('href', 'user.html?id=' + post.creatorID);
            UserLink.textContent = post.creatorData[0].username;
            UserHeader.appendChild(UserLink);

            const FrameContainer = document.createElement('div');
            FrameContainer.classList.add('embed-responsive');
            FrameContainer.classList.add('embed-responsive-16by9');
            const YouTubeFrame = document.createElement('iframe');
            YouTubeFrame.classList.add('embed-responsive-item');
            YouTubeFrame.setAttribute(
              'allow',
              'accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture'
            );
            YouTubeFrame.setAttribute('allowfullscreen', 'true');
            YouTubeFrame.setAttribute('src', post.source);
            FrameContainer.appendChild(YouTubeFrame);
            const Description = document.createElement('p');
            Description.textContent = post.description;

            const Tags = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const TagLink = document.createElement('a');
              TagLink.setAttribute('href', '/search.html?q=%23' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag;
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardHeader.appendChild(UserHeader);
            CardBody.appendChild(FrameContainer);
            CardBody.appendChild(Description);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardHeader);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'chat') {
            const Lines = post.content.split('\n');
            const Speakers = [];
            const Messages = [];

            Lines.forEach(line => {
              const SplitDone = line.split(':');
              Speakers.push(SplitDone[0]);
              Messages.push(SplitDone[1]);
            });

            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardHeader = document.createElement('div');
            CardHeader.classList.add('card-header');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

            const UserHeader = document.createElement('h5');
            const UserLink = document.createElement('a');
            UserLink.classList.add('user-link');
            UserLink.setAttribute('href', 'user.html?id=' + post.creatorID);
            UserLink.textContent = post.creatorData[0].username;
            UserHeader.appendChild(UserLink);

            for (let i = 0; i < Speakers.length; i++) {
              const P = document.createElement('p');
              const Speaker = document.createElement('span');
              const BoldText = document.createElement('strong');
              BoldText.textContent = Speakers[i] + ':';
              const Message = document.createElement('span');
              Message.textContent = Messages[i];
              Speaker.appendChild(BoldText);
              P.appendChild(Speaker);
              P.appendChild(Message);

              CardBody.appendChild(P);
            }
            const Tags = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const TagLink = document.createElement('a');
              TagLink.setAttribute('href', '/search.html?q=%23' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag + ' ';
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardHeader.appendChild(UserHeader);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardHeader);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function hideInputElement(elem) {
  elem.value = '';
  elem.style.display = 'none';
  PostOptions.style.display = '';
}

function postAudioForm() {
  const AudioForm = document.querySelector('#audio-form');
  const AudioTitleInput = document.querySelector('#audio-title-input');
  const PlayButton = document.querySelector('#play-button');
  const LoadingSpinner = document.querySelector('#loading-spinner');
  const AudioTitle = document.querySelector('#audio-title');

  let playButtonSrc;
  let accessToken;

  AudioTitleInput.style.display = '';
  PostOptions.style.display = 'none';

  AudioTitle.addEventListener('change', event => {
    event.stopImmediatePropagation();

    const SpotifyAPI =
      'https://api.spotify.com/v1/search?type=track&market=MX&limit=10&q=';
    const Query = AudioTitle.value.replace(/\s/g, '%20');

    LoadingSpinner.style.display = '';
    AudioTitleInput.style.display = 'none';

    fetch(API_URL + 'spotify')
      .then(response => response.json())
      .then(token => {
        accessToken = token.access_token;

        fetch(SpotifyAPI + Query, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
          .then(response => response.json())
          .then(track => {
            const Frame = document.querySelector('#spotify-frame');
            const Tracks = track.tracks.items;

            if (Tracks.length === 0)
              throw new Error('No track found with this title');

            AudioTitle.value = '';

            playButtonSrc =
              'https://open.spotify.com/embed/track/' +
              track.tracks.items[0].uri.replace('spotify:track:', '');

            Frame.setAttribute('src', playButtonSrc);
            PlayButton.appendChild(Frame);

            Frame.addEventListener('load', () => {
              PlayButton.style.display = '';
              LoadingSpinner.style.display = 'none';
              AudioForm.style.display = '';
            });
          })
          .catch(err => {
            AudioForm.reset();

            ErrorAlert.textContent = err.toString().substring(7);

            AudioForm.style.display = 'none';
            LoadingSpinner.style.display = 'none';
            PostOptions.style.display = '';
            ErrorAlert.style.display = '';

            setTimeout(() => {
              ErrorAlert.style.display = 'none';
            }, 3000);
          });
      });
  });

  AudioForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    AudioForm.style.display = 'none';
    PostOptions.style.display = '';

    const AudioData = new FormData(AudioForm);
    const AudioDescription = AudioData.get('audio-description');
    const AudioTags = AudioData.get('audio-tags');

    if (!validatePostContent(AudioDescription, AudioTags)) {
      AudioForm.reset();

      ErrorAlert.textContent =
        'Post must include a Description and at least one Tag';

      AudioForm.style.display = 'none';
      PostOptions.style.display = '';
      ErrorAlert.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else if (!validateTagsContent(AudioTags)) {
      AudioForm.reset();

      ErrorAlert.textContent = 'Tags must start with #';

      AudioForm.style.display = 'none';
      PostOptions.style.display = '';
      ErrorAlert.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      const PostData = {
        PlayButtonSrc: playButtonSrc,
        AudioDescription,
        AudioTags,
        type: 'audio'
      };

      fetch(POSTS_URL, {
        method: 'POST',
        body: JSON.stringify(PostData),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      })
        .then(response => response.json())
        .then(createdPost => {
          AudioForm.reset();
          listAllPosts();
        });
    }
  });

  CancelButtons[4].onclick = () => {
    PostOptions.style.display = '';
    AudioForm.style.display = 'none';
    AudioForm.reset();
  };
}

function postChatForm() {
  const ChatForm = document.querySelector('#chat-form');

  ChatForm.style.display = '';
  PostOptions.style.display = 'none';

  ChatForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    ChatForm.style.display = 'none';
    PostOptions.style.display = '';

    const ChatData = new FormData(ChatForm);
    const ChatContent = ChatData.get('chat-content');
    const ChatTags = ChatData.get('chat-tags');

    if (!validatePostContent(ChatContent, ChatTags)) {
      ChatForm.reset();

      ErrorAlert.textContent =
        'Post must include a Title, a Body, and at least one Tag';

      ChatForm.style.display = 'none';
      ErrorAlert.style.display = '';
      PostOptions.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else if (!validateTagsContent(ChatTags)) {
      TextForm.reset();

      ErrorAlert.textContent = 'Tags must start with #';

      ChatForm.style.display = 'none';
      ErrorAlert.style.display = '';
      PostOptions.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      const PostData = { ChatContent, ChatTags, type: 'chat' };

      fetch(POSTS_URL, {
        method: 'POST',
        body: JSON.stringify(PostData),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      })
        .then(response => response.json())
        .then(createdPost => {
          ChatForm.reset();
          listAllPosts();
        });
    }
  });

  CancelButtons[3].onclick = () => {
    PostOptions.style.display = '';
    ChatForm.style.display = 'none';
    ChatForm.reset();
  };
}

function postImageForm() {
  const FileFormGoup = document.querySelector('#file-form-group');
  const ImageForm = document.querySelector('#image-form');
  const ImageFile = document.querySelector('#image-file');
  const Preview = document.querySelector('#preview');
  let imageDataURL;

  // ImageForm.style.display = '';
  // ImageFileForm.style.display = '';
  FileFormGoup.style.display = '';

  PostOptions.style.display = 'none';

  ImageForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    ImageForm.style.display = 'none';
    PostOptions.style.display = '';
    Preview.style.display = 'none';

    const FileForm = new FormData();
    FileForm.append('file', ImageFile.files[0]);

    const ImageData = new FormData(ImageForm);
    const ImageCaption = ImageData.get('image-caption');
    const ImageTags = ImageData.get('image-tags');

    if (!validatePostContent(ImageCaption, ImageTags)) {
      ImageForm.reset();
      ImageFile.value = '';

      ErrorAlert.textContent =
        'Post must include a Caption and at least one Tag';

      ErrorAlert.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else if (!validateTagsContent(ImageTags)) {
      ImageForm.reset();
      ImageFile.value = '';

      ErrorAlert.textContent = 'Tags must start with #';

      ErrorAlert.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      fetch(IMG_URL, {
        method: 'POST',
        body: FileForm
      })
        .then(response => response.text())
        .then(response => {
          const ImgURL = IMG_URL + response;

          const PostData = { ImgURL, ImageCaption, ImageTags, type: 'image' };
          fetch(POSTS_URL, {
            method: 'POST',
            body: JSON.stringify(PostData),
            credentials: 'include',
            headers: { 'content-type': 'application/json' }
          })
            .then(response => response.json())
            .then(createdPost => {
              ImageForm.reset();
              ImageFile.value = '';
              listAllPosts();
            });
        });
    }
  });

  ImageFile.addEventListener(
    'change',
    event => {
      FileFormGoup.style.display = 'none';
      ImageForm.style.display = '';
      Preview.style.display = '';
      const Reader = new FileReader();
      Reader.onload = () => {
        imageDataURL = Reader.result;
        const Thumbnail = document.querySelector('#thumbnail');
        Thumbnail.src = imageDataURL;
        Preview.appendChild(Thumbnail);
      };
      Reader.readAsDataURL(ImageFile.files[0]);
    },
    false
  );

  CancelButtons[1].onclick = () => {
    PostOptions.style.display = '';
    FileFormGoup.style.display = 'none';
    ImageForm.style.display = 'none';
    Preview.style.display = 'none';
    ImageForm.reset();
  };
}

function postQuoteForm() {
  const QuoteForm = document.querySelector('#quote-form');

  PostOptions.style.display = 'none';
  QuoteForm.style.display = '';

  const QuoteContent = document.querySelector('#quote-content');

  QuoteContent.oninput = () => {
    QuoteContent.style.height = '';
    QuoteContent.style.height =
      Math.min(QuoteContent.scrollHeight, 82) * 1.1 + 'px';
  };
  QuoteForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    QuoteForm.style.display = 'none';
    PostOptions.style.display = '';

    const QuoteData = new FormData(QuoteForm);
    const QuoteContent = QuoteData.get('quote-content');
    const QuoteSource = QuoteData.get('quote-source');
    const QuoteTags = QuoteData.get('quote-tags');
    const PostData = { QuoteContent, QuoteSource, QuoteTags, type: 'quote' };

    if (!validatePostContent(QuoteContent, QuoteSource, QuoteTags)) {
      QuoteForm.reset();

      ErrorAlert.textContent =
        'Post must include a Quote, a Source, and at least one Tag';

      ErrorAlert.style.display = '';
      PostOptions.style.display = '';
      QuoteForm.style.display = 'none';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else if (!validateTagsContent(QuoteTags)) {
      QuoteForm.reset();

      ErrorAlert.textContent = 'Tags must start with #';

      ErrorAlert.style.display = '';
      PostOptions.style.display = '';
      QuoteForm.style.display = 'none';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      fetch(POSTS_URL, {
        method: 'POST',
        body: JSON.stringify(PostData),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      })
        .then(response => response.json())
        .then(createdPost => {
          QuoteForm.reset();
          listAllPosts();
        });
    }
  });

  CancelButtons[2].onclick = () => {
    PostOptions.style.display = '';
    QuoteForm.style.display = 'none';
    QuoteForm.reset();
  };
}

function postTextForm() {
  const TextForm = document.querySelector('#text-form');

  PostOptions.style.display = 'none';
  TextForm.style.display = '';

  TextForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const TextData = new FormData(TextForm);
    const TextTitle = TextData.get('text-title');
    const TextContent = TextData.get('text-content');
    const TextTags = TextData.get('text-tags');
    if (!validatePostContent(TextTitle, TextContent, TextTags)) {
      TextForm.reset();
      ErrorAlert.textContent =
        'Post must include a Title, a Body, and at least one Tag';
      PostOptions.style.display = '';
      TextForm.style.display = 'none';
      ErrorAlert.style.display = '';
      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else if (!validateTagsContent(TextTags)) {
      TextForm.reset();
      ErrorAlert.textContent = 'Tags must start with #';
      PostOptions.style.display = '';
      TextForm.style.display = 'none';
      ErrorAlert.style.display = '';
      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      const PostData =
        TextTags.trim === ''
          ? { TextTitle, TextContent, type: 'text' }
          : { TextTitle, TextContent, TextTags, type: 'text' };
      TextForm.style.display = 'none';
      PostOptions.style.display = '';

      fetch(POSTS_URL, {
        method: 'POST',
        body: JSON.stringify(PostData),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      })
        .then(response => response.json())
        .then(createdPost => {
          TextForm.reset();
          listAllPosts();
        });
    }
  });

  CancelButtons[0].onclick = () => {
    PostOptions.style.display = '';
    TextForm.style.display = 'none';
    TextForm.reset();
  };
}

function postVideoForm() {
  let EmbedURL = '';
  const VideoURL = document.querySelector('#video-url');
  const VideoURLInput = document.querySelector('#video-url-input');
  const VideoForm = document.querySelector('#video-form');
  let YouTubeID;

  PostOptions.style.display = 'none';
  VideoURL.style.display = '';

  VideoURLInput.addEventListener('change', event => {
    event.stopImmediatePropagation();

    let YouTubeURL;

    try {
      YouTubeURL = new URL(VideoURLInput.value);
    } catch (err) {
      VideoURL.style.display = 'none';
      VideoURLInput.value = '';

      ErrorAlert.textContent = 'Invalid YouTube URL';

      PostOptions.style.display = '';
      ErrorAlert.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
      return;
    }

    if (YouTubeURL.host.indexOf('youtu') < 0) {
      VideoURL.style.display = 'none';
      VideoURLInput.value = '';

      ErrorAlert.textContent = 'Invalid YouTube URL';

      PostOptions.style.display = '';
      ErrorAlert.style.display = '';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
      return;
    }

    YouTubeID =
      YouTubeURL.host === 'youtube.com' || YouTubeURL.host === 'www.youtube.com'
        ? YouTubeURL.search.substring(3, 14)
        : YouTubeURL.pathname.substring(1, 12);

    VideoForm.style.display = '';
    VideoURL.style.display = 'none';
    VideoURLInput.value = '';

    EmbedURL = 'https://www.youtube.com/embed/' + YouTubeID;
    document.querySelector('#youtube-iframe').setAttribute('src', EmbedURL);
    document.querySelector('#embeded-video').style.display = '';
  });

  VideoForm.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const VideoData = new FormData(VideoForm);
    const VideoDescription = VideoData.get('video-description');
    const VideoTags = VideoData.get('video-tags');

    if (!validatePostContent(VideoDescription, VideoTags)) {
      VideoForm.reset();

      ErrorAlert.textContent =
        'Post must include a Description and at least one Tag';

      PostOptions.style.display = '';
      ErrorAlert.style.display = '';
      VideoForm.style.display = 'none';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else if (!validateTagsContent(VideoTags)) {
      VideoForm.reset();

      ErrorAlert.textContent = 'Tags must start with #';

      PostOptions.style.display = '';
      ErrorAlert.style.display = '';
      VideoForm.style.display = 'none';

      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      const PostData = {
        URL: EmbedURL,
        VideoDescription,
        VideoTags,
        type: 'video'
      };

      PostOptions.style.display = '';
      VideoForm.style.display = 'none';

      fetch(POSTS_URL, {
        method: 'POST',
        body: JSON.stringify(PostData),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      })
        .then(response => response.json())
        .then(createdPost => {
          VideoForm.reset();
          listAllPosts();
        });
    }
  });

  CancelButtons[5].onclick = () => {
    PostOptions.style.display = '';
    VideoForm.style.display = 'none';
    VideoForm.reset();
  };
}

function toggleMenu(id) {
  const Menu = document.querySelector(id);
  Menu.style.display = Menu.style.display === 'none' ? '' : 'none';
}

function validatePostContent() {
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i].trim() === '') return false;
  }
  return true;
}

function validateTagsContent(tags) {
  const regex = new RegExp('(#\\w+)', 'g');
  const arr1 = tags.match(regex);
  const arr2 = tags.split(' ');

  if (JSON.stringify(arr1) === JSON.stringify(arr2)) return true;
  return false;
}
