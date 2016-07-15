import Sails from './Sails';
import {
    UserModel,
    UserExtendedModel,
    CommentModel,
    ActivityModel,
    GameModel,
    GameExtendedModel
} from 'player-core-models';

console.log("Realtime Models", [
    UserModel,
    UserExtendedModel,
    CommentModel,
    ActivityModel,
    GameModel,
    GameExtendedModel
]);

function validateListener(methodName, sailsInstance, callback){
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
 * @class Description of RealtimeService
 */
class RealtimeService extends Sails {
    constructor() {
        super();

        this._defaultConnectionOptions = {
            transports: ['websocket']
        };
    }

    /**
     * @param {function} callback
     * @returns {RealtimeService} Itself
     */
    verify(callback){
        this._socket.post('/verify', null, callback);
        return this;
    }

    sendTest(message){
        var params = { message: message };
        this._socket.post('/test', params);
        return this;
    }

    /**
     * @param {string} accessToken
     * @param {function} callback
     * @returns {RealtimeService} Itself
     */
    verifyWithOAuth(accessToken, callback){
        var params = { access_token: accessToken };
        this._socket.post('/verify', params, callback);
        return this;
    }

    /**
     * Subscribe to a specific activity
     * @param {int} activityId
     * @param {function} callback
     */
    subscribeToActivity(activityId, callback){
        if (!activityId) activityId = [];
        var params = { channel:'feed', key:activityId };
        this._socket.post('/rooms', params, callback);
    }

    /**
     * Subscribe to specific activities
     * @param {int[]} activityIds
     * @param {function} callback
     */
    subscribeToActivities(activityIds, callback){
        if (!activityIds) activityIds = [];
        var params = { channel:'feed', key:activityIds };
        this._socket.post('/rooms', params, callback);
    }

    /**
     * Subscribe to tabs in the feed.
     * @param tabs
     * @param callback
     */
    subscribeToFeed(tabs, callback){
        if (!tabs) tabs = ['following', 'discover'];
        var params = { channel:'feed-new', key:tabs };
        this._socket.post('/rooms', params, callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onTest(callback){
        Sails.validateListener('onTest', this, callback);
        this._socket.on('test', callback);
        return this;
    }

    /**
     * When a subscribed activity is updated.
     * @param {function} callback
     * @return {Sails} Itself
     */
    onActivityUpdate(callback){
        Sails.validateListener('onFeed', this, callback);
        this._socket.on('feed', callback);
        return this;
    }

    /**
     * When a new activity is added to the subscribed channels.
     * @param {function} callback
     * @return {Sails} Itself
     */
    onFeedUpdate(callback){
        Sails.validateListener('onFeedNew', this, callback);
        this._socket.on('feed-new', callback);
        return this;
    }

    //TODO app.deployed
    //TODO friend:online

    //TODO messaging:clear_unread_flag
    //TODO messaging:group_update
    //TODO messaging:mark_all_read
    //TODO messaging:mark_read
    //TODO messaging:new

    //TODO notifications:clear_unread_flag
    //TODO notifications:mark_read
    //TODO notifications:mark_all_read
    //TODO notifications:new

    //TODO sails:parseError
    //TODO streaming.refreshed
}

export default RealtimeService;