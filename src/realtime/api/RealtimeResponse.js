/**
 * @class The standard result for most Player responses
 */
class RealtimeResponse {
    constructor(rawObject) {
        this._action  = rawObject.action;
        this._channel = rawObject.channel;
        this._key     = rawObject.key;

        this._data = {};
        for (var key in rawObject){
            if (key !== 'action' && key !== 'channel' && key !== 'key'){
                if (rawObject.hasOwnProperty(key)){
                    this._data[key] = rawObject[key];
                }
            }
        }
    }

    /**
     * The action to be taken with this data.
     * @example "comment.add"
     * @returns {string}
     */
    get action(){
        return this._action;
    }

    /**
     * The channel this response came from.
     * @example "feed"
     * @returns {string}
     */
    get channel(){
        return this._channel;
    }

    /**
     * The key of this response within its channel.
     * @example 12345
     * @returns {*}
     */
    get key(){
        return this._key;
    }

    /**
     * The payload of the response.
     * Anything that isn't a property of RealtimeResponse.
     * @returns {object}
     */
    get data(){
        return this._data;
    }
}

export default RealtimeResponse;