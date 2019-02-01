const API_URL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:5000/posts': 'https://notumclo-api.glitch.me/posts';
const postsElement = document.querySelector('#postsFeed');

listAllPosts();

function listAllPosts() {
  postsElement.innerHTML = '';
  fetch(API_URL).then(response => response.json()).then(posts => {
    posts.reverse();
    posts.forEach(post => {
      if (post.type === 'text') {
        const div = document.createElement('div');
        const header = document.createElement('h3');
        header.textContent = post.title;
        const content = document.createElement('p');
        content.textContent = post.content;
        const tags = document.createElement('p');
        tags.textContent = post.tags;
        const date = document.createElement('small');
        date.textContent = new Date(post.created);

        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(tags);
        div.appendChild(date);

        postsElement.appendChild(div);
      }
    });
  })
}

function postTextForm() {
  const textForm = document.querySelector('#textForm');
  const displayStyle = textForm.style.display;
  textForm.style.display = displayStyle === 'none' ? '' : 'none';
  textForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const textData = new FormData(textForm);
    const textTitle = textData.get('textTitle');
    const textContent = textData.get('textContent');
    const textTags = textData.get('textTags');
    const postData = {textTitle, textContent, textTags, type: 'text'};
    textForm.style.display = 'none';

    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(createdPost => {
          textForm.reset();
          listAllPosts();
        });
  });
}