const API_URL = window.location.hostname === '127.0.0.1' ?
    'http://127.0.0.1:5000/posts' :
    'https://notumclo-api.glitch.me/posts';
const postsElement = document.querySelector('#postsFeed');
const postOptions = document.querySelector('#postOptions');
const cancelButton = document.querySelectorAll('.btn-cancel');

listAllPosts();

function listAllPosts() {
  // postsElement.innerHTML = '';
  while (postsElement.firstChild)
    postsElement.removeChild(postsElement.firstChild);
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
      } else if (post.type === 'image') {
        const div = document.createElement('div');
        const img = new Image();
        img.src = post.file;
        img.classList.add('img-fluid');
        img.setAttribute('style', 'max-height: 14em;');
        const caption = document.createElement('p');
        caption.textContent = post.caption;
        const tags = document.createElement('p');
        tags.textContent = post.tags;
        const date = document.createElement('small');
        date.textContent = new Date(post.created);

        div.appendChild(img);
        div.appendChild(caption);
        div.appendChild(tags);
        div.appendChild(date);

        postsElement.appendChild(div);
      }
    });
  });
}

function postImageForm() {
  const imageForm = document.querySelector('#imageForm');
  const preview = document.querySelector('#preview');
  const imageInput = document.querySelector('#imageFile');
  const fileFormGoup = document.querySelector('#fileFormGoup');
  let imageDataURL;
  postOptions.style.display = 'none';
  imageForm.style.display = '';
  imageForm.addEventListener('submit', event => {
    event.preventDefault();
    const imageData = new FormData(imageForm);
    const imageFile = imageDataURL;
    const imageCaption = imageData.get('imageCaption');
    const imageTags = imageData.get('imageTags');
    const postData = {imageFile, imageCaption, imageTags, type: 'image'};
    imageForm.style.display = 'none';
    postOptions.style.display = '';
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

  imageInput.addEventListener('change', event => {
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
  }, false);

  cancelButton[1].onclick = () => {
    postOptions.style.display = '';
    fileFormGoup.style.display = '';
    imageForm.style.display = 'none';
    preview.style.display = 'none';
    // while (preview.firstChild) preview.removeChild(preview.firstChild);
    imageForm.reset();
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
    const postData = {textTitle, textContent, textTags, type: 'text'};
    textForm.style.display = 'none';
    postOptions.style.display = '';

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

  cancelButton[0].onclick = () => {
    postOptions.style.display = '';
    textForm.style.display = 'none';
    textForm.reset();
  };
}
