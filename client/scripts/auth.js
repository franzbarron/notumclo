if (typeof API_URL === 'undefined') {
  API_URL =
    window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:5000/'
      : 'https://notumclo-api.glitch.me/';
}
const ErrorAlert = document.querySelector('#error-alert');
const Registration = document.querySelector('#registration');
const Login = document.querySelector('#login');

if (Registration)
  Registration.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const RegistrationData = new FormData(Registration);
    const Username = RegistrationData.get('username');
    const Email = RegistrationData.get('email');
    const Password = RegistrationData.get('password-registration');
    const PasswordConfirmation = RegistrationData.get('password-confirmation');

    if (Password !== PasswordConfirmation) {
      ErrorAlert.textContent = 'Passwords must match';
      ErrorAlert.style.display = '';
      setTimeout(() => {
        ErrorAlert.style.display = 'none';
      }, 3000);
    } else {
      const ReqBody = { Username, Email, Password };
      fetch(API_URL + 'registration', {
        method: 'POST',
        body: JSON.stringify(ReqBody),
        credentials: 'include',
        headers: { 'content-type': 'application/json' }
      })
        .then(response => {
          if (response.status !== 200) throw new Error('Error');
          else window.location.href = 'dashboard.html';
        })
        .catch(err => {
          console.error(err);
        });
    }
  });

if (Login)
  Login.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const EmailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );
    const LoginData = new FormData(Login);
    const Usermail = LoginData.get('usermail');
    const Password = LoginData.get('password-login');

    const ReqBody = EmailRegex.test(Usermail)
      ? { usermail: Usermail, password: Password, type: 'email' }
      : { usermail: Usermail, password: Password, type: 'username' };

    fetch(API_URL + 'login', {
      method: 'POST',
      body: JSON.stringify(ReqBody),
      credentials: 'include',
      headers: { 'content-type': 'application/json' }
    })
      .then(response => {
        if (response.status !== 200)
          throw new Error('Incorrect Username/Email and/or Password');
        else window.location.href = 'dashboard.html';
      })
      .catch(err => {
        console.error(err);
      });
  });
