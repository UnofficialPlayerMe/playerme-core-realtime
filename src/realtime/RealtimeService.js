import Sails from './Sails';

import FeedRealtime from './api/feed/FeedRealtime';

/**
 * @class The core Sails.io.js wrapper for PlayerMe
 */
class RealtimeService extends Sails {
    constructor() {
        super();

        this.feed = new FeedRealtime(this);

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
     * @param {function} callback
     * @return {Sails} Itself
     */
    onTest(callback){
        this.on('test', (data)=>{
            callback(data.message);
        });
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