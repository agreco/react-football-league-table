
var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    games = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, '..', 'data', 'games.json')))),
    INTERVAL_BASE = 250;

var copy = function (arr) {
    return arr.concat();
};

app.set('view engine', 'html'); // configure view engines

// ROUTES
app.use(express.static(path.resolve(path.join(__dirname, '../../', 'dest/client')), { maxAge: '1d' })); // Mount static files
app.use('/', require('./default')); // Mount index
app.use('/teams', require('./teams')); // Mount teams
app.use(function errorHandler (err, req, res, next) { // Mount Error handler
    res.status(err.status || 500);
    if (req.xhr) {
        res.json({ error: err.message });
    } else {
        res.send({ error: err.message });
    }
    console.error(err);
});

io.of('/games').on('connection', function (socket) {
    console.log('[%s] /games stream opened', new Date().toISOString());

    var queue = copy(games), loop = setTimeout(function tick () {
        socket.emit('gameplayed', JSON.stringify(queue.shift()));
        if (queue.length) loop = setTimeout(tick, parseInt(Math.random() * INTERVAL_BASE, 10));
    }, parseInt(Math.random() * INTERVAL_BASE, 10));

    socket.on('close', function () {
        console.log('[%s] /games stream closed', new Date().toISOString());
    });
});

var listen = exports.listen = function (port, host) {
    server.listen(port, host, function (arg1, arg2) {
        console.log('Server listening on http://%s:%d', host, port, '\n');
    });
};

if (require.main === module) {
    listen(process.env.PORT || 8080, process.env.HOST || 'localhost');
}
