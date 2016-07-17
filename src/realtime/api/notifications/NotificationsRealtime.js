import AbstractRealtimeAPI from '../AbstractRealtimeAPI';
import {NotificationModel} from 'player-core-models';

/**
 * @class Description of FeedRealtime
 */
class NotificationsRealtime extends AbstractRealtimeAPI {

    /** @inheritdoc */
    constructor(realtimeService) {
        super(realtimeService);
    }

    /**
     * TODO
     * @param {function} callback
     */
    onClearUnreadFlag(callback){
        this.service.on('notifications:clear_unread_flag', function(){
            console.info('notifications:clear_unread_flag', arguments);
            callback(); // No data to pass
        });
    }

    /**
     * TODO Split this up into different methods by Notification Method Type
     * @param {function} callback
     */
    onMarkRead(callback){
        this.service.on('notifications:mark_read', function(data){
            /**
             * Example `data.set`: "like_comment:c5391614"
             * Example `data.set`: "mention_comment:c5391614"
             * Example `data.set`: "reply_comment:c5391614"
             * @type {string}
             */
            var set = data.set;
            var split = set.split(':', 2);
            var notificationType = split[0];
            var notificationKey = split[1];

            console.info('notifications:mark_read', arguments);
            callback(notificationType, notificationKey);
        });
    }

    /**
     * Called when marking all notifications as read
     * @param {function} callback Takes nothing
     */
    onMarkReadAll(callback){
        this.service.on('notifications:mark_all_read', function(){
            console.info('notifications:mark_all_read', arguments);
            callback();
        });
    }

    /**
     * Callback is applied when a new notification is created
     * @param {function} callback Takes an array of NotificationModels in the shortlist
     */
    onNew(callback){
        this.service.on('notifications:new', function(data){
            /**
             * All notifications in list, both read and unread
             * TODO Convert to Notification Models
             * @type {NotificationModel[]}
             */
            try {
                var notifications = data.notifications.map((obj)=> {
                    return new NotificationModel(obj);
                });
            }catch(e){
                console.error("NotificationsRealtime.onNew Error:", e);
            }

            callback(notifications);
        });
    }
}

export default NotificationsRealtime;