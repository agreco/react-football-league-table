
var express = require('express'),
    path = require("path"),
    router = express.Router();

module.exports = router;

router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).sendFile(path.resolve(path.join(__dirname, '..', 'client', 'index.html')));
});
