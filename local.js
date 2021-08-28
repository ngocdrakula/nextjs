const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const socketio = require('socket.io');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler();

const exApp = express();
const server = createServer(exApp);
const io = socketio(server);
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    })
});

app.prepare().then(async () => {
    exApp.set('socket.io', io);
    exApp.get("/elo", (req, res) => {
        res.sendFile("HTML/index.html", { root: __dirname });
    });
    exApp.all('*', (req, res) => handle(req, res, parse(req.url, true)));
    server.listen(3000, (err) => {
        if (err) throw err
    })
})