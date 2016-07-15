const SailsIOClient = require('sails.io.js');
const SocketIo = require('socket.io-client');

/**
 * @class Description of RealtimeService
 */
class Sails {
    constructor() {
        this._io = new SailsIOClient(SocketIo);
        this._sails = this._io.sails;

        this._sails.autoConnect = false;

        /**
         * The socket connection
         * @member {SailsSocket}
         * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client
         * @protected
         */
        this._socket = null;

        /**
         * The default options to use when connecting
         * @type {object}
         * @protected
         */
        this._defaultConnectionOptions = {};
    }

    /**
     * Connect Sails to the specified server
     * @param {string} url              Server to connect to
     * @param {object} [options]        Custom options to override the defaults
     * @return {Sails} Itself
     */
    connect(url, options){
        // Validate
        if (typeof url !== 'string'){
            throw new TypeError("URL passed to Sails.connect() is not a string. ["+typeof url+"]");
        }
        if (url.length === 0){
            throw new Error("No URL passed to Sails.connect()");
        }
        if (options && typeof options !== 'object'){
            throw new TypeError("Options passed to Sails.connect() is not an object. ["+typeof options+"]");
        }

        // Set options
        var opts = this._defaultConnectionOptions || {};
        if (options){
            for (var key in options){
                if (options.hasOwnProperty(key)) {
                    opts[key] = options[key];
                }
            }
        }

        // Execute
        this._socket = this._sails.connect(url, opts);
        return this;
    }

    /**
     * Disconnect sails
     * @return {Sails} Itself
     */
    disconnect(){
        if (this._socket){
            this._socket.disconnect();
        }
        return this;
    }

    /**
     * Validate a listener before it is executed.
     * @param {string}    methodName
     * @param {Sails}    sailsInstance
     * @param {function} callback
     * @throws {TypeError}      When the callback isn't a function
     * @throws {ReferenceError} When callback isn't passed
     * @throws {Error}          When no socket exists
     */
    static validateListener(methodName, sailsInstance, callback){
        methodName = sailsInstance.constructor.name+"."+methodName+"()";

        if (typeof callback !== 'function'){
            throw new TypeError("Callback passed to "+methodName+" is not a function. ["+typeof callback+"]");
        }
        if (!callback){
            throw new ReferenceError("No callback passed to "+methodName+".");
        }
        if (!sailsInstance._socket){
            throw new Error("Socket not created before calling "+methodName+". Was connect() called?");
        }
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onConnect(callback){
        Sails.validateListener('onConnect', this, callback);
        this._socket.on('connect', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onError(callback){
        Sails.validateListener('onError', this, callback);
        this._socket.on('error', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onDisconnect(callback){
        Sails.validateListener('onDisconnect', this, callback);
        this._socket.on('disconnect', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnect(callback){
        Sails.validateListener('onReconnect', this, callback);
        this._socket.on('reconnect', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnectAttempt(callback){
        Sails.validateListener('onReconnectAttempt', this, callback);
        this._socket.on('reconnect_attempt', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnecting(callback){
        Sails.validateListener('onReconnecting', this, callback);
        this._socket.on('reconnecting', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnectError(callback){
        Sails.validateListener('onReconnectError', this, callback);
        this._socket.on('reconnect_error', callback);
        return this;
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnectFailed(callback){
        Sails.validateListener('onReconnectFailed', this, callback);
        this._socket.on('reconnect_failed', callback);
        return this;
    }
}

export default Sails;