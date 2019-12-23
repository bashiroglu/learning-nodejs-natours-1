/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const logIn = async (email, password) => {
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
      showAlert('success', 'logged in');
      window.setTimeout(() => {
        location.assign(
          '/'
        ); /* this is for rendering again, in other words to reload page again */
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
    // console.log(error.response);
  }
};
export const logOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success'))
      location.reload(
        true
      ); /* this true means hard, in other words, bring from server */
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
