import AbstractRealtimeAPI from '../AbstractRealtimeAPI';
import RealtimeResponse from '../RealtimeResponse';
import {ActivityModel, CommentModel} from 'player-core-models';

/**
 * @class Description of FeedRealtime
 */
class FeedRealtime extends AbstractRealtimeAPI {

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
     * When a new activity is added to the subscribed channels.
     * @param {function} callback
     */
    onFeedUpdate(callback){
        this.service.on('feed-new', function(data){
            var response = new RealtimeResponse(data);
            var activity = new ActivityModel(data.activity);
            callback(response, activity);
        });
    }

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
     * When a subscribed activity is updated.
     * @param {function} callback
     */
    onActivityUpdate(callback){
        this.service.on('feed', function(data){
            var response = new RealtimeResponse(data);
            var activity = new ActivityModel(data.activity);
            var comment = null;
            if (data.comment) {
                comment = new CommentModel(data.comment);
            }
            callback(response, activity, comment);
        });
    }
}

export default FeedRealtime;