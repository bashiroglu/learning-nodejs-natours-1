/* eslint-disable */
console.log('hello');
const logIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url:
        'http://localhost:3000/api/v1/users/login' /* use local host for CORS Error*/,
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      alert('logged in');
      window.setTimeout(() => {
        location.assign(
          '/'
        ); /* this is for rendering again, in other words to reload page again */
      }, 1500);
    }
  } catch (error) {
    console.log(error.response);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  logIn(email, password);
});
