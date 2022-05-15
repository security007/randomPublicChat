const express = require('express');
const app = express();
const http = require('http');
const validator = require('validator');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const host = "http://127.0.0.1"
const port = 3000
const version = "V 1.0"; 


app.set('view engine', 'ejs');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.render('home/index', { ver: version});
})


io.on('connection', (socket) => {
    var name = "";
    socket.on('login', (msg) => {
        name = msg;
        io.emit('login', msg);
    });
    socket.on('disconnect', () => {
        if (name !== '') {
            io.emit('logout',name+" Disconnected !!")
        }
    });
    socket.on('message', (username,msg) => {
        socket.broadcast.emit('message', validator.escape(username),validator.escape(msg));
    });
    socket.on('image', (username,image) => {
        socket.broadcast.emit('image', validator.escape(username),image);
    })
});
server.listen();
