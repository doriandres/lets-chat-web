const apiUrl = apiBaseUrl + '/api/users/auth';
if(userData){
  window.location = '/chat';
}
const form = document.getElementById('sign-in-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = { email: email.value, password: password.value };
  const response = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(data), 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());
  if (response.error) {
    alert("There was an error validating the credentials");
  } else {
    localStorage.setItem('user', JSON.stringify(response.result));
    window.location = '/chat';
  }
});
