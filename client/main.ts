import express from 'express';
import favicon from 'serve-favicon';
import http from 'http';
import path from 'path';
import axios from 'axios';

const port = process.env.CLIENT_PORT || 3000;
const api = process.env.API_URL || 'http://localhost:8888';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'favicon.ico')));

const storage = {
  async fetch() {
    console.log('here we fetch...', api);
    const resp = await axios.get(`${api}/contacts`);
    console.log('resp', resp);
    return resp.data;
  },
};

app.get('/', async (req, res) => {
  console.log('here i am, j.h.');
  const contacts = await storage.fetch();
  console.log('contacts are', contacts);
  res.render('index', {
    contacts,
  });
});

const server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);
