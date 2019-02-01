function postTextForm() {
  const textForm = document.querySelector('#textForm');
  const displayStyle = textForm.style.display;
  textForm.style.display = displayStyle === 'none' ? 'block' : 'none';
  textForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const textData = new FormData(textForm);
    const textTitle = textData.get('textTitle');
    const textContent = textData.get('textContent');
    const textTags = textData.get('textTags');
    const postData = {textTitle, textContent, textTags};
    console.log(postData);
    textForm.style.display = 'none';
  })
}