import express from "express";
import http from "http";
import cors from "cors";

import { query } from "./db";
import { Contact } from "./types";

const port = process.env.API_PORT || 8888;

const app = express();

app.use(cors());

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
  next();
});


app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/contacts", async (req, res) => {
  const { rows } = await query<Contact>("SELECT * FROM contacts", []);
  res.status(200).json(rows);
});

process.env.TZ = "ETC/Utc";

const server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);
