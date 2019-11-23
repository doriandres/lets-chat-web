const apiUrl = apiBaseUrl + '/api/users/create';
if(userData){
  window.location = '/chat';
}
const form = document.getElementById('sign-up-form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = { email: email.value, password: password.value, name: name.value };
  const response = await fetch(apiUrl, {
    method: 'POST', 
    body: JSON.stringify(data),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());
  if (response.error) {
    alert("Couldn't create user");
  } else {
    localStorage.setItem('user', JSON.stringify(response.result));
    window.location = '/chat';
  }
});
