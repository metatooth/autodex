import cors from 'cors';
import express from 'express';
import {
  Request, Response, NextFunction,
} from 'express';
import favicon from 'serve-favicon';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { query } from '../lib/db.js';
import { Contact } from '../lib/types.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const port = process.env.API_PORT || 8888;

const app = express();

app.use(cors());

app.use(favicon(path.join(dirname, 'favicon.ico')));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
  const { rows } = await query<Contact>('SELECT * FROM contacts WHERE deleted <> true', []);
  res.status(200).json(rows);
});

app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  await query("UPDATE contacts SET deleted = true, deletedat = CURRENT_TIMESTAMP WHERE id = $1", [id]);
  res.status(204).json({});
});

process.env.TZ = 'ETC/Utc';

const server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);
