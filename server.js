const express = require('express');
const path = require('path');

const app = express();

app.use(require('express-status-monitor')());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {})
});

app.get('/sign-in', (req, res) => {
  res.render('sign-in', {})
});

app.get('/sign-up', (req, res) => {
  res.render('sign-up', {})
});

app.get('/chat', (req, res) => {
  res.render('chat', {})
});

app.listen(8080, () =>{
  console.log('Server started on port 8080...');
});