import AbstractRealtimeAPI from '../AbstractRealtimeAPI';
import RealtimeResponse from '../RealtimeResponse';
import {ActivityModel, CommentModel} from 'player-core-models';

/**
 * @class Description of FeedRealtime
 */
class FeedRealtime extends AbstractRealtimeAPI {

    /** @inheritdoc */
    constructor(realtimeService) {
        super(realtimeService);

        /**
         * TODO Remove temp function to indicate that a channel-action has been mapped
         * @param {RealtimeResponse} response
         */
        var tempRoutedResponse = function(response){
            console.info("Routed", response.channel, response.action, arguments);
        };
        this._mapResponse("feed-new", "activity.add",    tempRoutedResponse);
        this._mapResponse("feed",     "activity.edit",   tempRoutedResponse);
        this._mapResponse("feed",     "activity.delete", tempRoutedResponse);
        this._mapResponse("feed",     "comment.add",     tempRoutedResponse);
        this._mapResponse("feed",     "comment.edit",    tempRoutedResponse);
        this._mapResponse("feed",     "comment.delete",  tempRoutedResponse);
    }

    // <editor-fold desc="Feed">

    /**
     * Subscribe to tabs in the feed.
     * @param {string[]} tabs
     */
    subscribeToFeed(tabs){
        if (!tabs) tabs = ['following', 'discover'];
        var params = { channel:'feed-new', key:tabs };
        this.service.post('/rooms', params);
    }

    /**
     * When a new activity is added to the subscribed channels.
     * @param {function} callback
     */
    onFeedUpdate(callback){
        this.service.on('feed-new', (data)=>{
            var response = new RealtimeResponse(data);
            var activity = new ActivityModel(data.activity);
            this._routeResponse(response, activity);
            callback(response, activity);
        });
    }

    // </editor-fold> Feed
    // <editor-fold desc="Activity">

    /**
     * Subscribe to a specific activity
     * @param {int} activityId
     */
    subscribeToActivity(activityId){
        var functionName = this.constructor.name+".subscribeToActivity()";

        // Check activityId
        if (!activityId) {
            throw new Error("No activityId passed to "+functionName+".");
        }
        if (typeof activityId !== 'number'){
            throw new TypeError(
                "activityId passed to "+functionName+" wasn't a number. ["+typeof activityId+"]"
            );
        }
        if (activityId <= 0){
            throw new RangeError(
                "activityId passed to "+functionName+" wasn't at least 1. ["+activityId+"]"
            );
        }

        // Execute
        var params = { channel:'feed', key:activityId };
        this.service.post('/rooms', params);
    }

    /**
     * Subscribe to specific activities
     * @param {int[]} activityIds
     */
    subscribeToActivities(activityIds){
        var functionName = this.constructor.name+".subscribeToActivities()";
        // Check activityIds
        if (!activityIds) {
            throw new Error("No activityIds passed to "+functionName+".");
        }
        if (!Array.isArray(activityIds)){
            throw new TypeError(
                "activityIds passed to "+functionName+ " wasn't an array. ["+typeof activityIds+"]"
            );
        }

        // Check each activityId
        for (let i in activityIds){
            let activityId = activityIds[i];
            if (typeof activityId !== 'number'){
                throw new TypeError(
                    "activityId passed to "+functionName+" wasn't a number. ["+typeof activityId+" at index "+i+"]"
                );
            }
            if (activityId <= 0){
                throw new RangeError(
                    "activityId passed to "+functionName+" wasn't at least 1. ["+activityId+" at index "+i+"]"
                );
            }
        }
        var params = { channel:'feed', key:activityIds };
        this.service.post('/rooms', params);
    }

    /**
     * When a subscribed activity is updated.
     * @param {function} callback
     */
    onActivityUpdate(callback){
        this.service.on('feed', (data)=>{
            var response = new RealtimeResponse(data);
            var activity = new ActivityModel(data.activity);
            var comment = null;
            if (data.comment) {
                comment = new CommentModel(data.comment);
            }

            this._routeResponse(response, activity, comment);
            callback(response, activity, comment);
        });
    }

    // </editor-fold> Activity
}

export default FeedRealtime;