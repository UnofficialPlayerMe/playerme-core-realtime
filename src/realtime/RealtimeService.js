import Sails from './Sails';

import FeedRealtime from './api/feed/FeedRealtime';

/**
 * @class The core Sails.io.js wrapper for PlayerMe
 */
class RealtimeService extends Sails {
    /**
     * @param {string} url       Server to connect to
     * @param {object} [options] Custom options to override the defaults
     */
    constructor(url, options) {
        super(url, options);

        this._verifiedUserId = 0;

        this._defaultConnectionOptions = {
            transports: ['websocket']
        };

        this._connect(url, options);

        this.feed = new FeedRealtime(this);
    }

    // <editor-fold desc="Verification">

    /**
     * This will link the Socket ID to the User ID,
     * so that the Sails can send user-wide messages to the correct sockets.
     * Send this immediately after connect.
     * @see http://docs.playerme.apiary.io/#reference/realtime/oauth/authenticate-+++
     * @param {function} [callback]
     * @returns {RealtimeService} Itself
     */
    verify(callback){
        // Use super's post method to avoid verification check
        super.post('/verify', null, (body, jwr)=>{
            if(body.id) {
                this._verifiedUserId = body.id;
            }
            if (callback){
                callback(body, jwr);
            }
        });
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
     * Whether the user has been verified
     * @returns {boolean}
     */
    get isVerified(){
        return this._verifiedUserId > 0;
    }

    /**
     * The ID of the verified user, or 0
     * @returns {int}
     */
    get verifiedUserId(){
        return this._verifiedUserId;
    }

    /**
     * Throw an error if the user isn't verified before calling the passed method name.
     * @param {string} methodName
     * @protected
     */
    _checkVerified(methodName){
        if (!this.isVerified){
            throw new Error(
                "The user must be verified before calling "+
                    this.constructor.name+"."+methodName+"."
            );
        }
    }

    // </editor-fold> Verification
    // <editor-fold desc="Debugging">

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

    // </editor-fold> Debugging
    // <editor-fold desc="Request Methods">

    /** @inheritdoc */
    get(url, data, callback){
        this._checkVerified('get()');
        super.get(url, data, callback);
    }

    /** @inheritdoc */
    post(url, data, callback){
        this._checkVerified('post()');
        super.post(url, data, callback);
    }

    /** @inheritdoc */
    put(url, data, callback){
        this._checkVerified('put()');
        super.put(url, data, callback);
    }

    /** @inheritdoc */
    del(url, data, callback){
        this._checkVerified('del()');
        super.del(url, data, callback);
    }

    // </editor-fold> Request Methods

    //TODO Likes: ["like_comment", "like_activity"],
    //TODO Comments: ["reply_comment", "reply_activity", "also_commented"],
    //TODO Mentions: ["mention_comment", "mention_activity"],
    //TODO Follows: ["follow"],
    //TODO Groups: ["group_request_user", "group_confirm_user", "group_deny_user", "group_remove_user", "group_request_admin", "group_confirm_admin", "group_deny_admin", "group_remove_admin"], "Game Attribute": ["game_attribute_approved", "game_suggestion_approved", "cover_approved", "cover_denied", "image_approved", "video_approved", "video_denied"],
    //TODO Companies: ["company_request_approved"],
    //TODO Achievements: ["badge_upgrade", "badge_new"],
    //TODO Partnership: ["partnership_approved"]
}

export default RealtimeService;