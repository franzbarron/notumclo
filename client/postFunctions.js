const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/'
    : 'https://notumclo-api.glitch.me/';
const POSTS_URL = API_URL + 'posts';
const IMG_URL = API_URL + 'img/';
const PostsFeed = document.querySelector('#posts-feed');
const PostOptions = document.querySelector('#post-options');
const CancelButtons = document.querySelectorAll('.btn-cancel');

listAllPosts();

function listAllPosts() {
  while (PostsFeed.firstChild) PostsFeed.removeChild(PostsFeed.firstChild);
  fetch(POSTS_URL)
    .then(response => response.json())
    .then(posts => {
      if (posts.length === 0) {
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
        posts.reverse();
        posts.forEach(post => {
          if (post.type === 'text') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

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
              TagLink.setAttribute('href', '/tags.html?' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag + ' ';
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardBody.appendChild(CardTitle);
            CardBody.appendChild(CardText);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'image') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            Card.classList.add('img-fluid');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

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
              TagLink.setAttribute('href', '/tags.html?' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag + ' ';
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            Card.appendChild(CardImg);
            CardBody.appendChild(CardText);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'quote') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

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
              TagLink.setAttribute('href', '/tags.html?' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag;
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardBody.appendChild(Blockquote);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'audio') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

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
              TagLink.setAttribute('href', '/tags.html?' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag;
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardBody.appendChild(FrameContainer);
            CardBody.appendChild(Description);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          } else if (post.type === 'video') {
            const Card = document.createElement('div');
            Card.classList.add('card');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

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
              TagLink.setAttribute('href', '/tags.html?' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag;
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);

            CardBody.appendChild(FrameContainer);
            CardBody.appendChild(Description);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
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
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const CardFooter = document.createElement('div');
            CardFooter.classList.add('card-footer');

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
              TagLink.setAttribute('href', '/tags.html?' + tag.substring(1));
              TagLink.classList.add('tag-link');
              TagLink.textContent = tag + ' ';
              Tags.appendChild(TagLink);
            });
            const PostDate = document.createElement('small');
            PostDate.classList.add('text-muted');
            PostDate.textContent = new Date(post.created);
            CardFooter.appendChild(Tags);
            CardFooter.appendChild(PostDate);
            Card.appendChild(CardBody);
            Card.appendChild(CardFooter);

            PostsFeed.appendChild(Card);
          }
        });
      }
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
          });
      });
  });

  AudioForm.addEventListener('submit', event => {
    event.preventDefault();
    const AudioData = new FormData(AudioForm);
    const AudioDescription = AudioData.get('audio-description');
    const AudioTags = AudioData.get('audio-tags');
    const PostData = {
      PlayButtonSrc: playButtonSrc,
      AudioDescription,
      AudioTags,
      type: 'audio'
    };

    AudioForm.style.display = 'none';
    PostOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(PostData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        AudioForm.reset();
        listAllPosts();
      });
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

    const ChatData = new FormData(ChatForm);
    const ChatContent = ChatData.get('chat-content');
    const ChatTags = ChatData.get('chat-tags');
    const PostData = { ChatContent, ChatTags, type: 'chat' };

    ChatForm.style.display = 'none';
    PostOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(PostData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        ChatForm.reset();
        listAllPosts();
      });
  });

  CancelButtons[3].onclick = () => {
    PostOptions.style.display = '';
    ChatForm.style.display = 'none';
    ChatForm.reset();
  };
}

function postImageForm() {
  const ImageForm = document.querySelector('#image-form');
  const Preview = document.querySelector('#preview');
  const ImageFile = document.querySelector('#image-file');
  const FileFormGoup = document.querySelector('#file-form-group');
  let imageDataURL;

  ImageForm.style.display = '';
  PostOptions.style.display = 'none';

  ImageForm.addEventListener('submit', event => {
    event.preventDefault();

    const FileForm = new FormData();
    FileForm.append('file', ImageFile.files[0]);

    const ImageData = new FormData(ImageForm);
    const ImageCaption = ImageData.get('image-caption');
    const ImageTags = ImageData.get('image-tags');

    FileFormGoup.style.display = '';
    ImageForm.style.display = 'none';
    PostOptions.style.display = '';
    Preview.style.display = 'none';
    ImageForm.reset();

    fetch(IMG_URL, {
      method: 'POST',
      body: FileForm
    })
      .then(response => response.text())
      .then(response => {
        const ImgURL = IMG_URL + response;
        console.log(ImgURL);

        const PostData = { ImgURL, ImageCaption, ImageTags, type: 'image' };
        fetch(POSTS_URL, {
          method: 'POST',
          body: JSON.stringify(PostData),
          headers: { 'content-type': 'application/json' }
        })
          .then(response => response.json())
          .then(createdPost => {
            ImageForm.reset();
            listAllPosts();
          });
      });
  });

  ImageFile.addEventListener(
    'change',
    event => {
      FileFormGoup.style.display = 'none';
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
    FileFormGoup.style.display = '';
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

    const QuoteData = new FormData(QuoteForm);
    const QuoteContent = QuoteData.get('quote-content');
    const QuoteSource = QuoteData.get('quote-source');
    const QuoteTags = QuoteData.get('quote-tags');
    const PostData = { QuoteContent, QuoteSource, QuoteTags, type: 'quote' };
    QuoteForm.style.display = 'none';
    PostOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(PostData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        QuoteForm.reset();
        listAllPosts();
      });
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

    const TextData = new FormData(TextForm);
    const TextTitle = TextData.get('text-title');
    const TextContent = TextData.get('text-content');
    const TextTags = TextData.get('text-tags');
    const PostData = { TextTitle, TextContent, TextTags, type: 'text' };
    TextForm.style.display = 'none';
    PostOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(PostData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        TextForm.reset();
        listAllPosts();
      });
  });

  CancelButtons[0].onclick = () => {
    PostOptions.style.display = '';
    TextForm.style.display = 'none';
    TextForm.reset();
  };
}

function postVideoForm() {
  let EmbedURL = 'https://www.youtube.com/embed/';
  const VideoURL = document.querySelector('#video-url');
  const VideoURLInput = document.querySelector('#video-url-input');
  const VideoForm = document.querySelector('#video-form');

  PostOptions.style.display = 'none';
  VideoURL.style.display = '';

  VideoURLInput.addEventListener('change', event => {
    const YouTubeURL = new URL(VideoURLInput.value);

    VideoForm.style.display = '';
    VideoURL.style.display = 'none';
    VideoURLInput.value = '';

    EmbedURL += YouTubeURL.search.substring(3);
    document.querySelector('#youtube-iframe').setAttribute('src', EmbedURL);
    document.querySelector('#embeded-video').style.display = '';
  });

  VideoForm.addEventListener('submit', event => {
    event.preventDefault();
    const VideoData = new FormData(VideoForm);
    const VideoDescription = VideoData.get('video-description');
    const VideoTags = VideoData.get('video-tags');
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
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        VideoForm.reset();
        listAllPosts();
      });
  });

  CancelButtons[5].onclick = () => {
    PostOptions.style.display = '';
    VideoForm.style.display = 'none';
    VideoForm.reset();
  };
}
