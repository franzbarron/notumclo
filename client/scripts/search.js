const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/search/'
    : 'https://notumclo-api.glitch.me/search/';
const Query =
  location.search.substring(3, 6) === '%23'
    ? '#' + location.search.substring(6)
    : location.search.substring(3);

let SearchButton =
  window.innerWidth < 576
    ? document.querySelector('#search-button-sm')
    : document.querySelector('#search-button-lg');
let SearchInput =
  window.innerWidth < 576
    ? document.querySelector('#search-input-sm')
    : document.querySelector('#search-input-lg');

window.onresize = () => {
  SearchButton =
    window.innerWidth < 576
      ? document.querySelector('#search-button-sm')
      : document.querySelector('#search-button-lg');
  SearchInput =
    window.innerWidth < 576
      ? document.querySelector('#search-input-sm')
      : document.querySelector('#search-input-lg');
};

if (location.search) {
  fetchPosts();
  fetchPeople();
} else {
  document.querySelector('#tabpanel').style.display = 'none';
}

function doSearch(event) {
  event.preventDefault();
  const SearchQuery =
    SearchInput.value.charAt(0) === '#'
      ? '%23' + SearchInput.value.substring(1)
      : SearchInput.value;

  location.href = location.origin + '/search.html?q=' + SearchQuery;
}

document.querySelector('#filter-btn').addEventListener('click', event => {
  event.stopImmediatePropagation();

  const FilterMenu = document.querySelector('#filter-menu')
  FilterMenu.style.display = '';

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', event => {
      event.stopImmediatePropagation();

      FilterMenu.style.display = 'none';
    })
  })
})

SearchButton.addEventListener('click', doSearch);
SearchInput.addEventListener('submit', doSearch);

if (location.search) {
  document.querySelector('title').textContent = Query + ' | notumclo';
  document.querySelector('#header').textContent = Query;
}

function parseAudioPost(post, htmlElement) {
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

  htmlElement.appendChild(Card);
}

function parseChatPost(post, htmlElement) {
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

  htmlElement.appendChild(Card);
}

function parseImagePost(post, htmlElement) {
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
  UserLink.textContent = post.creatorData[0].username;
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

  htmlElement.appendChild(Card);
}

function parseQuotePost(post, htmlElement) {
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

  htmlElement.appendChild(Card);
}

function parseTextPost(post, htmlElement) {
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

  htmlElement.appendChild(Card);
}

function parseUser(user, htmlElement) {
  const Card = document.createElement('div');
  Card.classList.add('card');
  Card.classList.add('text-center');
  const CardBody = document.createElement('div');
  CardBody.classList.add('card-body');
  const CardTitle = document.createElement('h5');
  CardTitle.classList.add('card-title');
  const UserLink = document.createElement('a');
  UserLink.setAttribute('href', 'user.html?id=' + user._id);
  UserLink.textContent = user.username;
  const CardText = document.createElement('p');
  CardText.classList.add('card-text');
  CardText.textContent = user.name;

  CardTitle.appendChild(UserLink);
  CardBody.appendChild(CardTitle);
  CardBody.appendChild(CardText);
  Card.appendChild(CardBody);
  htmlElement.appendChild(Card);
}

function parseVideoPost(post, htmlElement) {
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

  htmlElement.appendChild(Card);
}

function showNoResuts(htmlElement) {
  const Div = document.createElement('div');
  Div.classList.add('card');
  const CardBody = document.createElement('div');
  CardBody.classList.add('card-body');

  const Txt = document.createElement('p');
  Txt.classList.add('card-text');
  Txt.textContent = 'No posts available';

  CardBody.appendChild(Txt);
  Div.appendChild(CardBody);
  htmlElement.appendChild(Div);
}

function fetchPosts() {
  fetch(API_URL + 'all', {
    method: 'POST',
    body: JSON.stringify({ query: Query }),
    headers: { 'content-type': 'application/json' }
  })
    .then(response => response.json())
    .then(response => {
      const AudioTab = document.querySelector('#audio');
      const ChatTab = document.querySelector('#chat');
      const ImageTab = document.querySelector('#image');
      const LatestTab = document.querySelector('#latest');
      const QuoteTab = document.querySelector('#quote');
      const TextTab = document.querySelector('#text');
      const VideoTab = document.querySelector('#video');

      if (response.length === 0) {
        showNoResuts(AudioTab);
        showNoResuts(ChatTab);
        showNoResuts(ImageTab);
        showNoResuts(LatestTab);
        showNoResuts(QuoteTab);
        showNoResuts(TextTab);
        showNoResuts(VideoTab);
      } else {
        let emptyAudio = true;
        let emptyChat = true;
        let emptyImage = true;
        let emptyQuote = true;
        let emptyText = true;
        let emptyVideo = true;

        response.forEach(post => {
          if (post.type === 'audio') {
            emptyAudio = false;
            parseAudioPost(post, LatestTab);
            parseAudioPost(post, AudioTab);
          } else if (post.type === 'chat') {
            emptyChat = false;
            parseChatPost(post, LatestTab);
            parseChatPost(post, ChatTab);
          } else if (post.type === 'image') {
            emptyImage = false;
            parseImagePost(post, LatestTab);
            parseImagePost(post, ImageTab);
          } else if (post.type === 'quote') {
            emptyQuote = false;
            parseQuotePost(post, LatestTab);
            parseQuotePost(post, QuoteTab);
          } else if (post.type === 'text') {
            emptyText = false;
            parseTextPost(post, LatestTab);
            parseTextPost(post, TextTab);
          } else if (post.type === 'video') {
            emptyVideo = false;
            parseVideoPost(post, LatestTab);
            parseVideoPost(post, VideoTab);
          }
        });

        if (emptyAudio) showNoResuts(AudioTab);
        if (emptyChat) showNoResuts(ChatTab);
        if (emptyImage) showNoResuts(ImageTab);
        if (emptyQuote) showNoResuts(QuoteTab);
        if (emptyText) showNoResuts(TextTab);
        if (emptyVideo) showNoResuts(VideoTab);
      }
    });
}

function fetchPeople() {
  fetch(API_URL + 'people', {
    method: 'POST',
    body: JSON.stringify({ query: Query }),
    headers: { 'content-type': 'application/json' }
  })
    .then(response => response.json())
    .then(response => {
      const People = document.querySelector('#people');

      if (response.length === 0) {
        const Div = document.createElement('div');
        Div.classList.add('card');
        const CardBody = document.createElement('div');
        CardBody.classList.add('card-body');

        const Txt = document.createElement('p');
        Txt.classList.add('card-text');
        Txt.textContent = 'No users found';

        CardBody.appendChild(Txt);
        Div.appendChild(CardBody);
        People.appendChild(Div);
      } else {
        for (let i = 0; i < Math.ceil(response.length / 3); i++) {
          const Row = document.createElement('div');
          Row.classList.add('row');

          for (let j = 0; j < 3; j++) {
            const Col = document.createElement('div');
            Col.classList.add('col-sm');
            if (response[i * 3 + j] !== undefined)
              parseUser(response[i * 3 + j], Col);
            Row.appendChild(Col);
          }

          People.appendChild(Row);
        }
      }
    });
}
