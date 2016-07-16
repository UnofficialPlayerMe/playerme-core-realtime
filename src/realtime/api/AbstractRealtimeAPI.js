/**
 * @class Description of RealtimeService
 */
class AbstractRealtimeAPI {
    /**
     * @param {RealtimeService} realtimeService
     */
    constructor(realtimeService) {
        var className = this.constructor.name;
        if (className === 'AbstractRealtimeAPI'){
            throw new Error("AbstractRealtimeAPI is not supposed to be instantiated");
        }
        if (!realtimeService){
            throw new ReferenceError("realtimeService not passed to "+className);
        }

        /**
         * @member {RealtimeService}
         */
        this.service = realtimeService;

        /**
         * A 2D map of channels and actions to a list of functions
         * @member {object.<string, object.<string, function[]>>}
         * @private
         */
        this._responseMap = {};
    }

    /**
     * Indicate which methods `RealtimeResponse`s should be passed to,
     * based on their `channel` and `action`.
     *
     * @param {string} channel
     * @param {string} action
     * @param {function} method
     * @protected
     */
    _mapResponse(channel, action, method){
        // Ensure action object exists for channel
        if (!this._responseMap[channel]){
            this._responseMap[channel] = {};
        }

        // Ensure method array exists for action
        if (!this._responseMap[channel][action]){
            this._responseMap[channel][action] = [];
        }

        // Add method to array if not already there
        if (this._responseMap[channel][action].indexOf(method) < 0){
            this._responseMap[channel][action].push(method);
        }
    }

    /**
     * Pass the response to the methods mapped with _mapResponse().
     *
     * @param {RealtimeResponse} response
     * @param {...*} args Any other arguments to pass to mapped methods.
     * @protected
     */
    _routeResponse(response, ...args) {
        var channel = response.channel;
        var action = response.action;

        // Check it can be routed
        if (!channel || !action){
            return;
        }

        //TODO Remove this log when it's production ready
        if (!this._responseMap[channel]){
            console.error(
                "Channel '"+channel+"' not mapped for "+this.constructor.name+"."
            );
        } else if (!this._responseMap[channel][action]){
            console.error(
                "Action '"+action+"' not mapped for "+this.constructor.name+" channel '"+channel+"'."
            );
        }

        // Check it can be routed
        if (!this._responseMap[channel] || !this._responseMap[channel][action]){
            return;
        }

        // Pass to methods
        args.unshift(response); // Add response to args
        var methods = this._responseMap[channel][action]; // Get methods
        for (var i in methods){
            methods[i].apply(this, args);
        }
    }

}

export default AbstractRealtimeAPI;