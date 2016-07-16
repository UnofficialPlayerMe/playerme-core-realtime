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

        // Add listeners
        this.service.on('feed-new', (data)=>{
            var args = [
                new RealtimeResponse(data),
                new ActivityModel(data.activity)
            ];
            this._routeResponse.apply(this, args);
        });
        this.service.on('feed', (data)=>{
            var args = [
                new RealtimeResponse(data),
                new ActivityModel(data.activity)
            ];
            if (data.comment) {
                args.push(new CommentModel(data.comment));
            }
            this._routeResponse.apply(this, args);
        });
    }

    // <editor-fold desc="Events">

    /**
     * Listen out for activities added to the feed
     * Can be triggered once you subscribeToFeed().
     * @param {function} callback
     */
    onActivityAdded(callback){
        this._mapResponse("feed-new", "activity.add", callback);
    }

    /**
     * Listen out for an activity being edited.
     * Can be triggered once you subscribeToActivity().
     * @param {function} callback
     */
    onActivityEdited(callback){
        this._mapResponse("feed", "activity.edit", callback);
    }
    /**
     * Listen out for an activity being deleted.
     * Can be triggered once you subscribeToActivity().
     * @param {function} callback
     */
    onActivityDeleted(callback){
        this._mapResponse("feed", "activity.delete", callback);
    }

    /**
     * Listen out for a comment being edited to an activity.
     * Can be triggered once you subscribeToActivity().
     * @param {function} callback
     */
    onCommentAdded(callback){
        this._mapResponse("feed", "comment.add", callback);
    }

    /**
     * Listen out for an activity's comment being edited.
     * Can be triggered once you subscribeToActivity().
     * @param {function} callback
     */
    onCommentEdited(callback){
        this._mapResponse("feed", "comment.edit", callback);
    }

    /**
     * Listen out for an activity's comment being deleted.
     * Can be triggered once you subscribeToActivity().
     * @param {function} callback
     */
    onCommentDeleted(callback){
        this._mapResponse("feed", "comment.delete", callback);
    }

    // </editor-fold> Events
    // <editor-fold desc="Subscribe">

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

    // </editor-fold> Subscribe
}

export default FeedRealtime;