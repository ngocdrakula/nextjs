const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const socketio = require('socket.io');
const express = require('express');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler();


const httpsOptions = {
    key: fs.readFileSync("./certificates/ssl.key"),
    cert: fs.readFileSync("./certificates/ssl.crt"),
}
const exApp = express();
const server = createServer(httpsOptions, exApp);
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('connection');
    socket.on('online', (data) => {
        console.log(data)
    });
    socket.on('disconnect', () => {
        console.log('client disconnected');
    })
});

app.prepare().then(async () => {
    exApp.set('socket.io', io);
    exApp.get("/elo", (req, res) => {
        res.sendFile("HTML/index.html", { root: __dirname });
    });
    exApp.all('*', (req, res) => handle(req, res, parse(req.url, true)));
    server.listen(3001, (err) => {
        if (err) throw err
        console.log('> Ready on Port 3000')
    })
})