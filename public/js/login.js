/* eslint-disable */
console.log('hello');
const logIn = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url:
        'http://localhost:8000/api/v1/users/login' /* use local host for CORS Error*/,
      data: {
        email,
        password
      }
    });
    console.log(email, password);
  } catch (error) {
    console.log(error.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  logIn(email, password);
});
