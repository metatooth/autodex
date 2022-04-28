import express from "express";
import http from "http";
import path from "path";

const port = process.env.API_PORT || 6060;

const app = express();

const pub = path.join(__dirname, "public");

app.get("/", (req, res) => {
  res.sendFile(path.join(pub, "/index.html"));
});

app.use("/", express.static(pub));

const server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);
