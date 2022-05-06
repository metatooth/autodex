import cors from 'cors';
import express from 'express';
import favicon from 'serve-favicon';
import http from 'http';
import path from 'path';

import { query } from '../shared/db';
import { Contact } from '../shared/types';

const port = process.env.API_PORT || 8888;

const app = express();

app.use(cors());

app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
  next();
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/contacts', async (req, res) => {
  const { rows } = await query<Contact>('SELECT * FROM contacts', []);
  res.status(200).json(rows);
});

process.env.TZ = 'ETC/Utc';

const server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);
