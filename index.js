const http = require('http');
const express = require('express');
const io_client = require('socket.io-client');

const app = express();

const socketPool = new Map();
const socketIndexPool = new Map();
const arguments = process.argv;
const port = arguments[2] || 4000;
let socket = null;
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
    socket.emit('message', {
        name: 'wang',
        fromPort: port
    });
    res.send('ok');
});
const server = http.Server(app);
server.listen(port, () => {
    console.log('listening on port ' + port);
});