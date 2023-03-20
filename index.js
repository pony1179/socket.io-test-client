const http = require('http');
const express = require('express');
const io_client = require('socket.io-client');
const bodyParser = require('body-parser');

const app = express();

let socket = null;
let logined = false;
const socketPool = new Map();
const socketIndexPool = new Map();
const arguments = process.argv;
const port = arguments[2] || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

if (!socketPool.has(port)) {
    socket = io_client(`http://127.0.0.1:8000/server`); // nginx 代理端口，会代理到不同的 socket 服务
    socket.on('connect', () => {
        socketPool.set(port, socket);
        socketIndexPool.set(socket, port);
        console.log(`端口${port}与服务端的 socket 建立映射`);
    });
    socket.on('disconnect', () => {
        const port = socketIndexPool.get(socket);
        socketIndexPool.delete(socket);
        socketPool.delete(port);
    });
    socket.on('message', (data) => {
        const port = socketIndexPool.get(socket);
        console.log(port, '端口收到了数据', data);
    });
}
app.post('/message', (req, res) => {
    if (!logined) {
        res.send('not logined');
        return;
    }
    socket.emit('message', {
        name: 'wang',
        fromPort: port
    });
    res.send('ok');
});
app.post('/login', (req, res) => {
    const userId = req.body.userId;
    socket.emit('join', userId);
    logined = true;
    res.send('ok');
});



const server = http.Server(app);
server.listen(port, () => {
    console.log('listening on port ' + port);
});