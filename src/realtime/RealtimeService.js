import Sails from './Sails';

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
        this.post('/verify', null, callback);
        return this;
    }

    /**
     * @param {string} accessToken
     * @param {function} callback
     * @returns {RealtimeService} Itself
     */
    verifyWithOAuth(accessToken, callback){
        var params = { access_token: accessToken };
        this.post('/verify', params, callback);
        return this;
    }

    /**
     * Send a message which will be picked up by onTest()
     * @param {string} message The message to make the round-trip.
     * @returns {RealtimeService}
     */
    postTest(message){
        this.post('/test', {message: message});
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
        this.post('/rooms', params, callback);
    }

    /**
     * Subscribe to specific activities
     * @param {int[]} activityIds
     * @param {function} callback
     */
    subscribeToActivities(activityIds, callback){
        if (!activityIds) activityIds = [];
        var params = { channel:'feed', key:activityIds };
        this.post('/rooms', params, callback);
    }

    /**
     * Subscribe to tabs in the feed.
     * @param tabs
     * @param callback
     */
    subscribeToFeed(tabs, callback){
        if (!tabs) tabs = ['following', 'discover'];
        var params = { channel:'feed-new', key:tabs };
        this.post('/rooms', params, callback);
    }

    /**
     * @param {function} callback
     * @return {Sails} Itself
     */
    onTest(callback){
        this.on('test', callback);
        return this;
    }

    /**
     * When a subscribed activity is updated.
     * @param {function} callback
     * @return {Sails} Itself
     */
    onActivityUpdate(callback){
        this.on('feed', callback);
        return this;
    }

    /**
     * When a new activity is added to the subscribed channels.
     * @param {function} callback
     * @return {Sails} Itself
     */
    onFeedUpdate(callback){
        this.on('feed-new', callback);
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