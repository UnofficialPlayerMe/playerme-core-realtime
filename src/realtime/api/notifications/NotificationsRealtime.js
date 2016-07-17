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
     * TODO What is this for? No data to pass?
     * @param {function} callback
     * @example onClearUnreadFlag(function(){ ... });
     */
    onClearUnreadFlag(callback){
        this.service.on('notifications:clear_unread_flag', function(){
            console.info('notifications:clear_unread_flag', arguments);
            callback(); // No data to pass
        });
    }

    /**
     * Callback called when a notification has been read
     * @param {function} callback Accepts the notification type and key strings
     * @example onMarkRead(function(notificationType, notificationKey){ ... });
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

            callback(notificationType, notificationKey);
        });
    }

    /**
     * Callback called when marking all notifications as read
     * @param {function} callback Takes nothing
     * @example onMarkReadAll(function(){ ... });
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
     * @example onNew(function(notifications){ ... });
     */
    onNew(callback){
        this.service.on('notifications:new', function(data){
            try {
                var notifications = data.notifications.map((obj)=> {
                    return new NotificationModel(obj);
                });
                callback(notifications);
            }catch(e){
                console.error("NotificationsRealtime.onNew Error:", e);
            }
        });
    }
}

export default NotificationsRealtime;