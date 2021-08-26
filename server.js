const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const socketio = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl);

    }).listen(dev ? 3000 : 3001, (err) => {
        if (err) throw err
        // console.log('> Ready on Port 3000')
    })
    const io = new socketio.Server();
    io.attach(server);
    io.on('connection', (socket) => {
        console.log('connection');
        socket.emit('status', 'Hello from Socket.io');
        socket.on('disconnect', () => {
            console.log('client disconnected');
        })
    });
})