var SailsIoClient = require('sails.io.js');
var SocketIo = require('socket.io-client');

console.log('#################################################################');
console.log('# Setup');
console.log('#################################################################');
console.log('');

/**
 * @var {{
 *     managers: object.<string,Manager>
 *     protocol: int,
 *     connect: function,
 *     Manager: Manager,
 *     Socket: Socket,
 *     sails: object,
 *     socket: SailsSocket
 * }}
 * node_modules/socket.io-client/lib/index.js
 */
var io = new SailsIoClient(SocketIo);
io.sails.autoConnect = false;

/**
 * Socket
 * @var {{
 *     io: Manager,
 *     connected: boolean,
 *     disconnected: boolean,
 * }}
 */
var socket = io.connect('https://player.me:443', {
    transports: ['websocket'],
    agent: false

    //SSL options for Node.js client
    // pfx: null,
    // key: null,
    // passphrase: null,
    // cert: null,
    // ca: null,
    // ciphers: null,
    // rejectUnauthorized: true,

    //Other options for Node.js client
    // extraHeaders: undefined
});

// <editor-fold desc="Events">
socket.on('connect', onConnect);
socket.on('error', onError);
socket.on('disconnect', onDisconnect);
socket.on('reconnect', onReconnect);
socket.on('reconnect_attempt', onReconnectAttempt);
socket.on('reconnecting', onReconnecting);
socket.on('reconnect_error', onReconnectError);
socket.on('reconnect_failed', onReconnectFailed);
// </editor-fold>

console.log('');
console.log('#################################################################');
console.log('# Responses');
console.log('#################################################################');
console.log('');

// <editor-fold desc="Event methods">

/**
 * Fired upon a successful connection.
 */
function onConnect(){
    console.log('onConnect');
}

/**
 * Fired upon a connection error/
 * @param {object} error Error Data
 */
function onError(error){
    console.error('onError:', error.type, error.description+" - "+error.message);
    console.error(error);
    socket.disconnect();
}

/**
 * Fired upon a disconnection.
 */
function onDisconnect(){
    console.log('onDisconnect');
}
/**
 * Fired upon a successful reconnection.
 * @param {int} count reconnection attempt number
 */
function onReconnect(count){
    console.log('onReconnect', count);
}

/**
 * Fired upon an attempt to reconnect.
 */
function onReconnectAttempt(){
    console.log('onReconnectAttempt');
}

/**
 * Fired upon an attempt to reconnect.
 * @param {int} count reconnection attempt number
 */
function onReconnecting(count){
    console.log('onReconnecting', count);
}

/**
 * Fired upon a reconnection attempt error.
 * @param {object} error Error object
 */
function onReconnectError(error){
    console.error('onReconnectError:', error.type, error.description+" - "+error.message);
    console.error(error);
    socket.disconnect();
}

/**
 * Fired when couldn’t reconnect within reconnectionAttempts.
 */
function onReconnectFailed(){
    console.error('onReconnectFailed');
}

// </editor-fold>