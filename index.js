var SailsIOClient = require('sails.io.js');
var SocketIO = require('socket.io-client');

console.log('=================================================================');
console.log('');

global.location = {
    // "origin": "http://localhost:3000",
    // "pathname": "/",
    // "host": "localhost:3000",
    // "hostname": "localhost",
    // "port": "3000",
    // "search": "",
    // "hash": "#home",
    // "href": "http://localhost:3000/#home",
    "protocol": "https:"
};

/**
 * @var {{Manager:function, Socket:function, sails:object}}
 * node_modules/socket.io-client/lib/index.js
 */
var io = new SailsIOClient(SocketIO);
io.sails.autoConnect = false;
io.sails.url = 'https://player.me:443';
io.sails.transports = ['websocket']; //['polling', 'websocket'];

console.log("io");
for (var ioKey in io) console.log(">", ioKey, typeof io[ioKey]);
console.log(io);

console.log('');
console.log('=================================================================');
console.log('=================================================================');
console.log('=================================================================');
console.log('');

var socket = io.connect();

console.log("socket", socket);

socket.on('connect', function () { console.log('on connect', arguments); });
socket.on('connect_failed', function () { console.error('on connect_failed', arguments); });
socket.on('connect_timeout', function () { console.error('on connect_timeout', arguments); });
socket.on('disconnect', function () { console.log('on disconnect', arguments); });
socket.on('error', function (exception) {
    console.error('on error:', exception.type, exception.description+" - "+exception.message);
    console.error(exception);
    socket.disconnect();
});
socket.on('reconnect_error', function (exception) {
    console.error('on reconnect_error:', exception.type, exception.description+" - "+exception.message);
    console.error(exception);
    socket.disconnect();
});

console.log('');
console.log('=================================================================');
console.log('=================================================================');
console.log('=================================================================');
console.log('');