import AbstractRealtimeAPI from '../AbstractRealtimeAPI';
import {ActivityModel, CommentModel} from 'player-core-models';

/**
 * @class Description of FeedRealtime
 */
class FeedRealtime extends AbstractRealtimeAPI {

    /**
     * Subscribe to a specific activity
     * @param {int} activityId
     * @param {function} callback
     */
    subscribeToActivity(activityId, callback){
        var params = { channel:'feed', key:activityId };
        this.service.post('/rooms', params, callback);
    }

    /**
     * Subscribe to specific activities
     * @param {int[]} activityIds
     * @param {function} callback
     */
    subscribeToActivities(activityIds, callback){
        if (!activityIds) activityIds = [];
        var params = { channel:'feed', key:activityIds };
        this.service.post('/rooms', params, callback);
    }

    /**
     * Subscribe to tabs in the feed.
     * @param tabs
     * @param callback
     */
    subscribeToFeed(tabs, callback){
        if (!tabs) tabs = ['following', 'discover'];
        var params = { channel:'feed-new', key:tabs };
        this.service.post('/rooms', params, callback);
    }

    /**
     * When a subscribed activity is updated.
     * @param {function} callback
     */
    onActivityUpdate(callback){
        this.service.on('feed', callback);
    }

    /**
     * When a new activity is added to the subscribed channels.
     * @param {function} callback
     */
    onFeedUpdate(callback){
        this.service.on('feed-new', callback);
    }
}

export default FeedRealtime;