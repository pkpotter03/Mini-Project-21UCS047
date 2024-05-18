const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: __dirname });
});

app.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: __dirname });
});

app.get('/resume', (req, res) => {
  res.sendFile('resume.html', { root: __dirname });
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const query = db.query('INSERT INTO users (username, email, password) VALUES (?,?,?)', [username, email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Registration failed.');
    }
    console.log('User registered successfully!');
    res.redirect('/resume');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Login failed.');
    }
    if (rows.length > 0) {
      req.session.users = rows[0];
      console.log('Login successful!');
      res.redirect('/resume');
    } else {
      res.redirect('/login?error=Invalid+username+or+password.');
    }
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
