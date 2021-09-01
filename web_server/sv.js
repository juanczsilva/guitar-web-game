const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const clientPath = `${__dirname}/../web_client`;
const port = 8080;

app.use(express.static(clientPath));
console.log(`Serving static from ${clientPath}`);

server.on("error", (err) => {
    console.log(`Error: ${err.name} - ${err.message}`);
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
