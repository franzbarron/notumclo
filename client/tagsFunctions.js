const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/tag'
    : 'https://notumclo-api.glitch.me/tag';
const postsFeed = document.querySelector('#postsFeed');
const query = window.location.search.substring(1);

document.querySelector('title').textContent = query + ' | notumclo';
document.querySelector('#header').textContent = '#' + query;
listResutls();

function listResutls() {  
  fetch(API_URL, {
    method: 'POST',
    body: query,
    headers: {
      'conten-type': 'text/plain'
    }
  })
    .then(respone => respone.json())
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
          postsFeed.appendChild(div);
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
              content.setAttribute('style', 'white-space: pre-line;');
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
  
              postsFeed.appendChild(div);
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
  
              postsFeed.appendChild(div);
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
  
              postsFeed.appendChild(div);
            }
          });
        }
      });
}
