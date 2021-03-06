const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/'
    : 'https://notumclo-api.glitch.me/';
const PostsFeed = document.querySelector('#posts-feed');
const Query = window.location.search.substring(4);

let username;

fetch(API_URL + 'user-data', {
  method: 'POST',
  body: Query,
  headers: {
    'content-type': 'text/plain'
  }
})
  .then(respone => respone.json())
  .then(userData => {
    const UserName = userData.name;
    username = userData.username;
    document.querySelector('title').textContent = UserName + ' | notumclo';
    document.querySelector('#header').textContent = UserName;

    listResutls();
  });

function listResutls() {
  fetch(API_URL + 'user', {
    method: 'POST',
    body: Query,
    headers: {
      'content-type': 'text/plain'
    }
  })
    .then(respone => respone.json())
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
            UserLink.setAttribute('href', '#');
            UserLink.textContent = username;
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
              TagLink.setAttribute(
                'href',
                '/search.html?q=%23' + tag.substring(1)
              );
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
            UserLink.setAttribute('href', '#');
            UserLink.textContent = username;
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
              TagLink.setAttribute(
                'href',
                '/search.html?q=%23' + tag.substring(1)
              );
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
            UserLink.setAttribute('href', '#');
            UserLink.textContent = username;
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
              TagLink.setAttribute(
                'href',
                '/search.html?q=%23' + tag.substring(1)
              );
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
            UserLink.setAttribute('href', '#');
            UserLink.textContent = username;
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
              TagLink.setAttribute(
                'href',
                '/search.html?q=%23' + tag.substring(1)
              );
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
            UserLink.setAttribute('href', '#');
            UserLink.textContent = username;
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
              TagLink.setAttribute(
                'href',
                '/search.html?q=%23' + tag.substring(1)
              );
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
            UserLink.setAttribute('href', '#');
            UserLink.textContent = username;
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
              TagLink.setAttribute(
                'href',
                '/search.html?q=%23' + tag.substring(1)
              );
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
    });
}
