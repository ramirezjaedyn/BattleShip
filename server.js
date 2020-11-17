const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const server = require('http').Server(app);
const io = require('./server/config/socket.conf').listen(server);

app.use(express.static(__dirname + "/dist"));

app.get("*", (req, res) => {
    res.sendFile('/dist/index.html', { root: __dirname + '/' });
});
app.listen(PORT);