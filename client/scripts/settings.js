const API_URL =
  window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/'
    : 'https://notumclo-api.glitch.me/';

let userID;

fetch(API_URL + 'profile', {
  method: 'GET',
  credentials: 'include'
})
  .then(response => response.json())
  .then(id => {
    userID = id;
    fetchUserData();
  });

function fetchUserData() {
  fetch(API_URL + 'user-data', {
    method: 'POST',
    body: userID,
    headers: {
      'content-type': 'text/plain'
    }
  })
    .then(respone => respone.json())
    .then(UserData => {
      document
        .querySelector('#email')
        .setAttribute('placeholder', UserData.email);
      document
        .querySelector('#name')
        .setAttribute('placeholder', UserData.name);
      document
        .querySelector('#username')
        .setAttribute('placeholder', UserData.username);
    });
}

function handleError(err) {
  const ErrorAlert = document.querySelector('#error-alert');

  ErrorAlert.textContent = err;
  ErrorAlert.style.display = '';
  setTimeout(() => {
    ErrorAlert.style.display = 'none';
  }, 3000);
  console.error(err);
}

function showSuccess() {
  const SuccessAlert = document.querySelector('#success-alert');

  SuccessAlert.textContent = 'Your information was updated successfully';
  SuccessAlert.style.display = '';
  setTimeout(() => {
    SuccessAlert.style.display = 'none';
  }, 3000);
}

document.querySelector('#user-settings').addEventListener('submit', event => {
  event.preventDefault();
});

const EditEmail = document.querySelector('#edit-email');
const EditName = document.querySelector('#edit-name');
const EditPassword = document.querySelector('#edit-password');
const EditUsername = document.querySelector('#edit-username');

EditEmail.addEventListener('click', event => {
  event.stopImmediatePropagation();

  const Email = document.querySelector('#email');
  const SaveEmail = document.querySelector('#save-email');

  EditEmail.style.display = 'none';
  Email.removeAttribute('readonly');
  Email.focus();
  SaveEmail.style.display = '';

  function updateEmail(event) {
    event.stopImmediatePropagation();

    const Body = { id: userID, field: 'email', value: Email.value };

    fetch(API_URL + 'update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Body)
    })
      .then(response => {
        EditEmail.style.display = '';
        Email.setAttribute('readonly', 'true');
        SaveEmail.style.display = 'none';
        if (response.status === 200) {
          Email.setAttribute('placeholder', Email.value);
          Email.value = '';
          showSuccess();
        } else if (response.status === 409)
          throw new Error('There is already an account with this email.');
        else throw new Error('There was a problem with the request');
      })
      .catch(error => {
        handleError(error.toString().substring(7));
      });
  }

  Email.addEventListener('change', updateEmail);
  SaveEmail.addEventListener('click', updateEmail);
});

EditName.addEventListener('click', event => {
  event.stopImmediatePropagation();

  const Name = document.querySelector('#name');
  const SaveName = document.querySelector('#save-name');

  EditName.style.display = 'none';
  Name.removeAttribute('readonly');
  Name.focus();
  SaveName.style.display = '';

  function updateName(event) {
    event.stopImmediatePropagation();

    const Body = { id: userID, field: 'name', value: Name.value };

    fetch(API_URL + 'update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Body)
    });

    EditName.style.display = '';
    Name.setAttribute('placeholder', Name.value);
    Name.setAttribute('readonly', 'true');
    Name.value = '';
    SaveName.style.display = 'none';
    showSuccess();
  }

  Name.addEventListener('change', updateName);
  SaveName.addEventListener('click', updateName);
});

EditPassword.addEventListener('click', event => {
  event.stopImmediatePropagation();

  const Password = document.querySelector('#password');
  const PasswordConfirmation = document.querySelector('#password-confirmation');
  const PasswordForms = document.querySelectorAll('.password-forms');
  const PasswordNew = document.querySelector('#password-new');
  const SavePassword = document.querySelector('#save-password');

  Password.focus();
  Password.removeAttribute('readonly');

  EditPassword.style.display = 'none';
  PasswordForms.forEach(form => {
    form.style.display = '';
  });

  SavePassword.addEventListener('click', event => {
    event.stopImmediatePropagation();

    if (PasswordNew.value === PasswordConfirmation.value) {
      const Body = {
        id: userID,
        current: Password.value,
        new: PasswordNew.value
      };
      fetch(API_URL + 'update-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Body)
      })
        .then(response => {
          Password.setAttribute('placeholder', '********');
          Password.setAttribute('readonly', 'true');

          Password.value = '';
          PasswordConfirmation.value = '';
          PasswordNew.value = '';

          EditPassword.style.display = '';
          PasswordForms.forEach(form => {
            form.style.display = 'none';
          });

          if (response.status === 200) {
            showSuccess();
          } else if (response.status === 401) {
            throw new Error('Wrong Password');
          } else {
            throw new Error('There was a problem with the request');
          }
        })
        .catch(error => {
          handleError(error.toString().substring(7));
        });
    } else handleError('Passwords must match');
  });
});

EditUsername.addEventListener('click', event => {
  event.stopImmediatePropagation();

  const Username = document.querySelector('#username');
  const SaveUsername = document.querySelector('#save-username');

  EditUsername.style.display = 'none';
  Username.removeAttribute('readonly');
  Username.focus();
  SaveUsername.style.display = '';

  function updateUsername(event) {
    event.stopImmediatePropagation();

    const Body = { id: userID, field: 'username', value: Username.value };

    fetch(API_URL + 'update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Body)
    })
      .then(response => {
        EditUsername.style.display = '';
        Username.setAttribute('readonly', 'true');
        SaveUsername.style.display = 'none';
        if (response.status === 200) {
          Username.setAttribute('placeholder', Username.value);
          Username.value = '';
          showSuccess();
        } else if (response.status === 409)
          throw new Error('There is already an account with this username.');
        else throw new Error('There was a problem with the request');
      })
      .catch(error => {
        handleError(error.toString().substring(7));
      });
  }

  SaveUsername.addEventListener('click', updateUsername);
  Username.addEventListener('change', updateUsername);
});
