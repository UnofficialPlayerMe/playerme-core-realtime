const SailsIOClient = require('sails.io.js');
const SocketIo = require('socket.io-client');

/**
 * @class The base wrapper class for sails.io.js
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

        /**
         * The URL used to connect
         * @type {string}
         * @private
         */
        this._url = null;

        /**
         * The options used to connect
         * @type {object}
         * @private
         */
        this._options = null;
    }

    // <editor-fold desc="Connection">

    /**
     * Connect to the specified Sails.io server
     * @param {string} url       Server to connect to
     * @param {object} [options] Custom options to override the defaults
     * @protected
     */
    _connect(url, options){
        // Validate
        var functionName = this.constructor.name+"._connect()";
        if (typeof url !== 'string'){
            throw new TypeError("URL passed to "+functionName+" is not a string. ["+typeof url+"]");
        }
        if (url.length === 0){
            throw new Error("No URL passed to "+functionName+".");
        }
        if (options && typeof options !== 'object'){
            throw new TypeError("Options passed to "+functionName+" is not an object. ["+typeof options+"]");
        }

        // Store values
        this._url = url;
        this._options = options;

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
     * Reconnect with the arguments last passed to _connect().
     * @protected
     */
    _reconnect(){
        this._connect(this._url, this._options);
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

    // </editor-fold> Connection
    // <editor-fold desc="Listeners">

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onConnect(callback) {
        return this.on('connect', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onError(callback){
        return this.on('error', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onDisconnect(callback){
        return this.on('disconnect', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnect(callback){
        return this.on('reconnect', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnectAttempt(callback){
        return this.on('reconnect_attempt', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnecting(callback){
        return this.on('reconnecting', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnectError(callback){
        return this.on('reconnect_error', callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onReconnectFailed(callback){
        return this.on('reconnect_failed', callback);
    }

    // </editor-fold> Listeners
    // <editor-fold desc="Listener Methods">

    /**
     * Start listening for server-sent events from Sails with the specified eventIdentity.
     * Will trigger the provided callback function when a matching event is received.
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-on
     *
     * @param {string} eventIdentity The unique identity of a server-sent event, e.g. "recipe"
     * @param {function} callback    Will be called when the server emits a message to this socket.
     * @return {Sails} Itself
     *
     * @throws ReferenceError When a parameter wasn't specified
     * @throws TypeError When a parameter is the wrong type
     * @throws Error When the socket wasn't created first
     */
    on(eventIdentity, callback){
        this._validateEventListener(this.constructor.name+'.on()', eventIdentity, callback);
        this._socket.on(eventIdentity, callback);
        return this;
    }

    /**
     * Unbind the specified event handler (opposite of .on()).
     *
     * If you decide to use this method, be careful!
     * off() does not stop the this client-side socket from receiving any server-sent messages,
     * it just prevents the specified event handler from firing.
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-off
     *
     * @param {string} eventIdentity The unique identity of a server-sent event, e.g. "recipe"
     * @param {function} callback    Will be called when the server emits a message to this socket.
     * @return {Sails} Itself
     *
     * @throws ReferenceError When a parameter wasn't specified
     * @throws TypeError When a parameter is the wrong type
     * @throws Error When the socket wasn't created first
     */
    off(eventIdentity, callback){
        this._validateEventListener(this.constructor.name+'.off()', eventIdentity, callback);
        this._socket.off(eventIdentity, callback);
        return this;
    }

    // </editor-fold> Listener Methods
    // <editor-fold desc="Request Methods">

    /**
     * Send a virtual request to a Sails server using Socket.io.
     * @param {string}   method     The HTTP request method. (e.g. get/post/put/delete)
     * @param {string}   url        The destination URL path. (e.g. "/checkout")
     * @param {object}   [data]     Data to be included as the request body.
     * @param {object}   [headers]  Dictionary of request headers.
     * @param {function} [callback] Takes a body object and an object with headers, body and statusCode.
     * @return {Sails} Itself
     *
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-request
     * @throws ReferenceError When an argument is missing.
     * @throws TypeError      When an argument is the wrong type.
     * @throws RangeError     When an invalid method is passed.
     * @throws Error          When the socket doesn't exist.
     */
    request(method, url, data, headers, callback){
        // Validate
        var functionName = this.constructor.name+'.request()';
        this._validateRequest(functionName, url, data, callback);

        // Check method passed
        if (!method){
            throw new ReferenceError(
                "No `method` passed to "+functionName+"."
            );
        }

        // Check method is a string
        if (typeof method !== 'string'){
            throw new TypeError(
                "`method` passed to "+functionName+" was not a string. ["+typeof method+"]"
            );
        }

        // Check method is valid
        var availableMethods = ['get', 'post', 'put', 'delete'];
        method = method.toLowerCase();
        if (availableMethods.indexOf(method) < 0){
            throw new RangeError(
                "`method` passed to "+functionName+" is not available. ["+availableMethods.join('/')+"]"
            );
        }

        // Validate headers
        if (headers && typeof headers !== 'object'){
            throw new TypeError("`headers` passed to "+functionName+" was not an object. ["+typeof headers+"]");
        }

        // Execution
        var params = {
            method: method,
            url: url
        };
        if (data){
            params.data = data;
        }
        if (headers){
            params.headers = headers;
        }
        this._socket.request(params, callback);
        return this;
    }

    /**
     * Send a socket request (virtual GET) to a Sails server using Socket.io.
     * @param {string}   url      The destination URL path; e.g. "/checkout".
     * @param {object}   [data]   Data to be included as the request body.
     * @param {function} callback Takes a body object and an object with headers, body and statusCode.
     * @return {Sails} Itself
     *
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-get
     * @throws ReferenceError When an argument is missing.
     * @throws TypeError      When an argument is the wrong type.
     * @throws Error          When the socket doesn't exist.
     */
    get(url, data, callback){
        this._validateRequest(this.constructor.name+'.get()', url, data, callback);
        return this._socket.get(url, data, callback);
    }

    /**
     * Send a socket request (virtual POST) to a Sails server using Socket.io.
     * @param {string}   url      The destination URL path; e.g. "/checkout".
     * @param {object}   [data]   Data to be included as the request body.
     * @param {function} callback Takes a body object and an object with headers, body and statusCode.
     * @return {Sails} Itself
     *
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-post
     * @throws ReferenceError When an argument is missing.
     * @throws TypeError      When an argument is the wrong type.
     * @throws Error          When the socket doesn't exist.
     */
    post(url, data, callback){
        this._validateRequest(this.constructor.name+'.post()', url, data, callback);
        return this._socket.post(url, data, callback);
    }

    /**
     * Send a socket request (virtual PUT) to a Sails server using Socket.io.
     * @param {string}   url      The destination URL path; e.g. "/checkout".
     * @param {object}   [data]   Data to be included as the request body.
     * @param {function} callback Takes a body object and an object with headers, body and statusCode.
     * @return {Sails} Itself
     *
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-put
     * @throws ReferenceError When an argument is missing.
     * @throws TypeError      When an argument is the wrong type.
     * @throws Error          When the socket doesn't exist.
     */
    put(url, data, callback){
        this._validateRequest(this.constructor.name+'.put()', url, data, callback);
        return this._socket.put(url, data, callback);
    }

    /**
     * Send a socket request (virtual DELETE) to a Sails server using Socket.io.
     * @param {string}   url      The destination URL path; e.g. "/checkout".
     * @param {object}   [data]   Data to be included as the request body.
     * @param {function} callback Takes a body object and an object with headers, body and statusCode.
     * @return {Sails} Itself
     *
     * @see http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-delete
     * @throws ReferenceError When an argument is missing.
     * @throws TypeError      When an argument is the wrong type.
     * @throws Error          When the socket doesn't exist.
     */
    del(url, data, callback){
        this._validateRequest(this.constructor.name+'.del()', url, data, callback);
        return this._socket['delete'](url, data, callback);
    }

    // </editor-fold> Request Methods
    // <editor-fold desc="Validation">

    /**
     * Check that arguments for on()/off() are valid.
     *
     * @param {string}   functionName  The method to be mentioned in error messages.
     * @param {string}   eventIdentity The unique identity of a server-sent event, e.g. "recipe".
     * @param {function} callback      Will be called when the server emits a message to this socket.
     *
     * @protected
     * @throws ReferenceError When a parameter wasn't specified
     * @throws TypeError When a parameter is the wrong type
     * @throws Error When the socket wasn't created first
     */
    _validateEventListener(functionName, eventIdentity, callback){
        if (!eventIdentity){
            throw new ReferenceError(
                "No eventIdentity passed to "+functionName+"."
            );
        }
        if (typeof eventIdentity !== 'string'){
            throw new TypeError(
                "eventIdentity passed to "+functionName+" was not a string. ["+typeof eventIdentity+"]"
            );
        }
        if (!callback){
            throw new ReferenceError(
                "No callback passed to "+functionName+"."
            );
        }
        if (typeof callback !== 'function'){
            throw new TypeError(
                "callback passed to "+functionName+" was not a string. ["+typeof callback+"]"
            );
        }
        if (!this._socket){
            throw new Error(
                "Socket not created before calling "+functionName+". Was _connect() called?"
            );
        }
    }

    /**
     * Check that arguments for request() or get/post/put/del() are valid.
     *
     * @param {string}   functionName The name of the function to be used in error messages.
     * @param {string}   url          The destination URL path; e.g. "/checkout".
     * @param {object}   [data]       Data to be included as the request body.
     * @param {function} [callback]   Takes a body object and an object with headers, body and statusCode.
     *
     * @protected
     * @throws ReferenceError When an argument is missing.
     * @throws TypeError      When an argument is the wrong type.
     * @throws Error          When the socket doesn't exist.
     */
    _validateRequest(functionName, url, data, callback){
        // Check URL passed
        if (!url){
            throw new ReferenceError(
                "No `url` passed to "+functionName+"."
            );
        }

        // Check URL is a string
        if (typeof url !== 'string'){
            throw new TypeError(
                "`url` passed to "+functionName+" was not a string. ["+typeof url+"]"
            );
        }

        // Check data is an object if it was passed
        if (data && typeof data !== 'object'){
            throw new TypeError(
                "`data` passed to "+functionName+" was not an object. ["+typeof data+"]"
            );
        }

        // Check callback is a function
        if (callback && typeof callback !== 'function'){
            throw new TypeError(
                "`callback` passed to "+functionName+" was not a function. ["+typeof callback+"]"
            );
        }

        // Check socket exists
        if (!this._socket){
            throw new Error(
                "Socket not created before calling "+functionName+". Was _connect() called?"
            );
        }
    }

    // </editor-fold> Validation
}

export default Sails;