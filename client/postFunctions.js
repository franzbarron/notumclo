const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/'
    : 'https://notumclo-api.glitch.me/';
const POSTS_URL = API_URL + 'posts';
const IMG_URL = API_URL + 'img/';
const postsElement = document.querySelector('#postsFeed');
const postOptions = document.querySelector('#postOptions');
const cancelButton = document.querySelectorAll('.btn-cancel');

listAllPosts();

function listAllPosts() {
  while (postsElement.firstChild)
    postsElement.removeChild(postsElement.firstChild);
  fetch(POSTS_URL)
    .then(response => response.json())
    .then(posts => {
      if (posts.length === 0) {
        const div = document.createElement('div');
        div.classList.add('card');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const txt = document.createElement('p');
        txt.classList.add('card-text');
        txt.textContent = 'No posts available';

        cardBody.appendChild(txt);
        div.appendChild(cardBody);
        postsElement.appendChild(div);
      } else {
        posts.reverse();
        posts.forEach(post => {
          if (post.type === 'text') {
            const div = document.createElement('div');
            div.classList.add('card');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const footer = document.createElement('div');
            footer.classList.add('card-footer');

            const header = document.createElement('h3');
            header.classList.add('card-title');
            header.textContent = post.title;
            const content = document.createElement('p');
            content.classList.add('card-text');
            content.textContent = post.content;

            const tagsP = document.createElement('p');
            const postTags = post.tags.split(' ');
            postTags.forEach(tag => {
              const tags = document.createElement('a');
              tags.setAttribute('href', '/tags.html?' + tag.substring(1));
              tags.classList.add('tag-link');
              tags.textContent = tag + ' ';
              tagsP.appendChild(tags);
            });
            const date = document.createElement('small');
            date.classList.add('text-muted');
            date.textContent = new Date(post.created);

            cardBody.appendChild(header);
            cardBody.appendChild(content);
            footer.appendChild(tagsP);
            footer.appendChild(date);
            div.appendChild(cardBody);
            div.appendChild(footer);

            postsElement.appendChild(div);
          } else if (post.type === 'image') {
            const div = document.createElement('div');
            div.classList.add('card');
            div.classList.add('img-fluid');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const footer = document.createElement('div');
            footer.classList.add('card-footer');

            const img = new Image();
            img.src = post.file;
            img.classList.add('card-img-top');

            const caption = document.createElement('p');
            caption.classList.add('card-text');
            caption.setAttribute('style', 'white-space: pre-line;');
            caption.textContent = post.caption;

            const tagsP = document.createElement('p');
            const postTags = post.tags.split(' ');
            postTags.forEach(tag => {
              const tags = document.createElement('a');
              tags.setAttribute('href', '/tags.html?' + tag.substring(1));
              tags.classList.add('tag-link');
              tags.textContent = tag + ' ';
              tagsP.appendChild(tags);
            });
            const date = document.createElement('small');
            date.classList.add('text-muted');
            date.textContent = new Date(post.created);

            div.appendChild(img);
            cardBody.appendChild(caption);
            footer.appendChild(tagsP);
            footer.appendChild(date);
            div.appendChild(cardBody);
            div.appendChild(footer);

            postsElement.appendChild(div);
          } else if (post.type === 'quote') {
            const div = document.createElement('div');
            div.classList.add('card');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const footer = document.createElement('div');
            footer.classList.add('card-footer');

            const blockQuote = document.createElement('blockquote');
            const content = document.createElement('p');
            content.classList.add('mb-0');
            content.setAttribute('style', 'white-space: pre-line;');
            content.textContent = post.content;
            const source = document.createElement('footer');
            source.classList.add('blockquote-footer');
            source.textContent = post.source;
            blockQuote.appendChild(content);
            blockQuote.appendChild(source);

            const tagsP = document.createElement('p');
            const postTags = post.tags.split(' ');
            postTags.forEach(tag => {
              const tags = document.createElement('a');
              tags.setAttribute('href', '/tags.html?' + tag.substring(1));
              tags.classList.add('tag-link');
              tags.textContent = tag;
              tagsP.appendChild(tags);
            });
            const date = document.createElement('small');
            date.classList.add('text-muted');
            date.textContent = new Date(post.created);

            cardBody.appendChild(blockQuote);
            footer.appendChild(tagsP);
            footer.appendChild(date);
            div.appendChild(cardBody);
            div.appendChild(footer);

            postsElement.appendChild(div);
          } else if (post.type === 'audio') {
            const div = document.createElement('div');
            div.classList.add('card');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const footer = document.createElement('div');
            footer.classList.add('card-footer');

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

            const tagsP = document.createElement('p');
            const postTags = post.tags.split(' ');
            postTags.forEach(tag => {
              const tags = document.createElement('a');
              tags.setAttribute('href', '/tags.html?' + tag.substring(1));
              tags.classList.add('tag-link');
              tags.textContent = tag;
              tagsP.appendChild(tags);
            });
            const date = document.createElement('small');
            date.classList.add('text-muted');
            date.textContent = new Date(post.created);

            cardBody.appendChild(FrameContainer);
            cardBody.appendChild(Description);
            footer.appendChild(tagsP);
            footer.appendChild(date);
            div.appendChild(cardBody);
            div.appendChild(footer);

            postsElement.appendChild(div);
          } else if (post.type === 'video') {
            const div = document.createElement('div');
            div.classList.add('card');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const footer = document.createElement('div');
            footer.classList.add('card-footer');

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

            const tagsP = document.createElement('p');
            const postTags = post.tags.split(' ');
            postTags.forEach(tag => {
              const tags = document.createElement('a');
              tags.setAttribute('href', '/tags.html?' + tag.substring(1));
              tags.classList.add('tag-link');
              tags.textContent = tag;
              tagsP.appendChild(tags);
            });
            const date = document.createElement('small');
            date.classList.add('text-muted');
            date.textContent = new Date(post.created);

            cardBody.appendChild(FrameContainer);
            cardBody.appendChild(Description);
            footer.appendChild(tagsP);
            footer.appendChild(date);
            div.appendChild(cardBody);
            div.appendChild(footer);

            postsElement.appendChild(div);
          } else if (post.type === 'chat') {
            const lines = post.content.split('\n');
            const speakers = [];
            const messages = [];

            lines.forEach(line => {
              const SplitDone = line.split(':');
              speakers.push(SplitDone[0]);
              messages.push(SplitDone[1]);
            });

            const Div = document.createElement('div');
            Div.classList.add('card');
            const CardBody = document.createElement('div');
            CardBody.classList.add('card-body');
            const Footer = document.createElement('div');
            Footer.classList.add('card-footer');

            for(let i = 0; i < speakers.length; i++) {
              const P = document.createElement('p');
              const Speaker = document.createElement('span');
              const BoldText = document.createElement('strong');
              BoldText.textContent = speakers[i] + ':';
              const Message = document.createElement('span');
              Message.textContent = messages[i];
              Speaker.appendChild(BoldText);
              P.appendChild(Speaker);
              P.appendChild(Message);

              CardBody.appendChild(P);
            }
            const TagsP = document.createElement('p');
            const PostTags = post.tags.split(' ');
            PostTags.forEach(tag => {
              const Tags = document.createElement('a');
              Tags.setAttribute('href', '/tags.html?' + tag.substring(1));
              Tags.classList.add('tag-link');
              Tags.textContent = tag + ' ';
              TagsP.appendChild(Tags);
            });
            const date = document.createElement('small');
            date.classList.add('text-muted');
            date.textContent = new Date(post.created);
            Footer.appendChild(TagsP);
            Footer.appendChild(date);
            Div.appendChild(CardBody);
            Div.appendChild(Footer);

            postsElement.appendChild(Div);
          }
        });
      }
    });
}

function hideInputElement(elem) {
  elem.value = '';
  elem.style.display = 'none';
  postOptions.style.display = '';
}

function postAudioForm() {
  const audioForm = document.querySelector('#audioForm');
  const AudioTitleInput = document.querySelector('#audioTitleInput');
  const ButtonPlay = document.querySelector('#playButton');
  const LoadingSpinner = document.querySelector('#loadingSpinner');
  const titleInput = document.querySelector('#audioTitle');

  let PlayButtonSrc;
  let accessToken;

  AudioTitleInput.style.display = '';
  postOptions.style.display = 'none';

  titleInput.addEventListener('change', event => {
    const SpotifyAPI =
      'https://api.spotify.com/v1/search?type=track&market=MX&limit=10&q=';
    const query = titleInput.value.replace(/\s/g, '%20');

    LoadingSpinner.style.display = '';
    AudioTitleInput.style.display = 'none';

    fetch(API_URL + 'spotify')
      .then(response => response.json())
      .then(token => {
        accessToken = token.access_token;

        fetch(SpotifyAPI + query, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
          .then(response => response.json())
          .then(track => {
            const frame = document.querySelector('#SpotifyIframe');

            document.querySelector('#audioTitle').value = '';

            PlayButtonSrc =
              'https://open.spotify.com/embed/track/' +
              track.tracks.items[0].uri.replace('spotify:track:', '');

            frame.setAttribute('src', PlayButtonSrc);
            ButtonPlay.appendChild(frame);

            frame.addEventListener('load', () => {
              ButtonPlay.style.display = '';
              LoadingSpinner.style.display = 'none';
              audioForm.style.display = '';
            });
          });
      });
  });

  audioForm.addEventListener('submit', event => {
    event.preventDefault();
    const AudioData = new FormData(audioForm);
    const AudioDescription = AudioData.get('audioDescription');
    const AudioTags = AudioData.get('audioTags');
    const PostData = {
      PlayButtonSrc,
      AudioDescription,
      AudioTags,
      type: 'audio'
    };

    audioForm.style.display = 'none';
    postOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(PostData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        audioForm.reset();
        listAllPosts();
      });
  });

  cancelButton[4].onclick = () => {
    postOptions.style.display = '';
    audioForm.style.display = 'none';
    audioForm.reset();
  };
}

function postChatForm() {
  const ChatForm = document.querySelector('#chat-form');

  ChatForm.style.display = '';
  postOptions.style.display = 'none';

  ChatForm.addEventListener('submit', event => {
    event.preventDefault();

    const ChatData = new FormData(ChatForm);
    const ChatContent = ChatData.get('chat-content');
    const ChatTags = ChatData.get('chat-tags');
    const PostData = { ChatContent, ChatTags, type: 'chat' };

    ChatForm.style.display = 'none';
    postOptions.style.display = '';

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

  cancelButton[3].onclick = () => {
    postOptions.style.display = '';
    ChatForm.style.display = 'none';
    ChatForm.reset();
  }
}

function postImageForm() {
  const imageForm = document.querySelector('#imageForm');
  const preview = document.querySelector('#preview');
  const imageInput = document.querySelector('#imageFile');
  const fileFormGoup = document.querySelector('#fileFormGoup');
  let imageDataURL;
  imageForm.style.display = '';
  postOptions.style.display = 'none';
  imageForm.addEventListener('submit', event => {
    event.preventDefault();
    const FileForm = new FormData();
    FileForm.append('file', imageInput.files[0]);
    const imageData = new FormData(imageForm);
    const imageCaption = imageData.get('imageCaption');
    const imageTags = imageData.get('imageTags');
    fileFormGoup.style.display = '';
    imageForm.style.display = 'none';
    postOptions.style.display = '';
    preview.style.display = 'none';
    imageForm.reset();
    fetch(IMG_URL, {
      method: 'POST',
      body: FileForm
    })
      .then(response => response.text())
      .then(response => {
        const ImgURL = IMG_URL + response;
        console.log(ImgURL);

        const postData = { ImgURL, imageCaption, imageTags, type: 'image' };
        fetch(POSTS_URL, {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: { 'content-type': 'application/json' }
        })
          .then(response => response.json())
          .then(createdPost => {
            imageForm.reset();
            listAllPosts();
          });
      });
  });

  imageInput.addEventListener(
    'change',
    event => {
      fileFormGoup.style.display = 'none';
      preview.style.display = '';
      const reader = new FileReader();
      reader.onload = () => {
        imageDataURL = reader.result;
        const thumbnail = document.querySelector('#thumbnail');
        thumbnail.src = imageDataURL;
        preview.appendChild(thumbnail);
      };
      reader.readAsDataURL(imageInput.files[0]);
    },
    false
  );

  cancelButton[1].onclick = () => {
    postOptions.style.display = '';
    fileFormGoup.style.display = '';
    imageForm.style.display = 'none';
    preview.style.display = 'none';
    imageForm.reset();
  };
}

function postQuoteForm() {
  const quoteForm = document.querySelector('#quoteForm');
  postOptions.style.display = 'none';
  quoteForm.style.display = '';
  const quoteContent = document.querySelector('#quoteContent');
  quoteContent.oninput = () => {
    quoteContent.style.height = '';
    quoteContent.style.height =
      Math.min(quoteContent.scrollHeight, 82) * 1.1 + 'px';
  };
  quoteForm.addEventListener('submit', event => {
    event.preventDefault();
    const quoteData = new FormData(quoteForm);
    const quoteContent = quoteData.get('quoteContent');
    const quoteSource = quoteData.get('quoteSource');
    const quoteTags = quoteData.get('quoteTags');
    const postData = { quoteContent, quoteSource, quoteTags, type: 'quote' };
    quoteForm.style.display = 'none';
    postOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        quoteForm.reset();
        listAllPosts();
      });
  });

  cancelButton[2].onclick = () => {
    postOptions.style.display = '';
    quoteForm.style.display = 'none';
    quoteForm.reset();
  };
}

function postTextForm() {
  const textForm = document.querySelector('#textForm');
  postOptions.style.display = 'none';
  textForm.style.display = '';
  textForm.addEventListener('submit', event => {
    event.preventDefault();
    const textData = new FormData(textForm);
    const textTitle = textData.get('textTitle');
    const textContent = textData.get('textContent');
    const textTags = textData.get('textTags');
    const postData = { textTitle, textContent, textTags, type: 'text' };
    textForm.style.display = 'none';
    postOptions.style.display = '';

    fetch(POSTS_URL, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: { 'content-type': 'application/json' }
    })
      .then(response => response.json())
      .then(createdPost => {
        textForm.reset();
        listAllPosts();
      });
  });

  cancelButton[0].onclick = () => {
    postOptions.style.display = '';
    textForm.style.display = 'none';
    textForm.reset();
  };
}

function postVideoForm() {
  let EmbedURL = 'https://www.youtube.com/embed/';
  const VideoURL = document.querySelector('#video-url');
  const VideoURLInput = document.querySelector('#video-url-input');
  const VideoForm = document.querySelector('#video-form');

  postOptions.style.display = 'none';
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

    postOptions.style.display = '';
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

  cancelButton[5].onclick = () => {
    postOptions.style.display = '';
    VideoForm.style.display = 'none';
    VideoForm.reset();
  };
}
