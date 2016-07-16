import AbstractRealtimeAPI from '../AbstractRealtimeAPI';

// <editor-fold desc="Notification Types">

// Likes
const LIKE_COMMENT = 'like_comment';
const LIKE_ACTIVITY = 'like_activity';

// Comments
const REPLY_COMMENT = 'reply_comment';
const REPLY_ACTIVITY = 'reply_activity';
const ALSO_COMMENTED = 'also_commented';

// Mentions
const MENTION_COMMENT = 'mention_comment';
const MENTION_ACTIVITY = 'mention_activity';

// Follows
const FOLLOW = 'follow';

// Groups
const GROUP_REQUEST_USER = 'group_request_user';
const GROUP_CONFIRM_USER = 'group_confirm_user';
const GROUP_DENY_USER = 'group_deny_user';
const GROUP_REMOVE_USER = 'group_remove_user';
const GROUP_REQUEST_ADMIN = 'group_request_admin';
const GROUP_CONFIRM_ADMIN = 'group_confirm_admin';
const GROUP_DENY_ADMIN = 'group_deny_admin';
const GROUP_REMOVE_ADMIN = 'group_remove_admin';

// Game Attribute
const GAME_ATTRIBUTE_APPROVED = 'game_attribute_approved';
const GAME_SUGGESTION_APPROVED = 'game_suggestion_approved';
const COVER_APPROVED = 'cover_approved';
const COVER_DENIED = 'cover_denied';
const IMAGES_APPROVED = 'image_approved';
const VIDEO_APPROVED = 'video_approved';
const VIDEO_DENIED = 'video_denied';

// Companies
const COMPANY_REQUEST_APPROVED = 'company_request_approved';

// Achievements
const BADGE_UPGRADE = 'badge_upgrade';
const BADGE_NEW = 'badge_new';

// Partnership
const PARTNERSHIP_APPROVED = 'partnership_approved';

// </editor-fold> Notification Types

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
     * TODO
     * @param {function} callback
     */
    onMarkReadAll(callback){
        this.service.on('notifications:mark_all_read', function(){
            console.info('notifications:mark_all_read', arguments);
            callback(); // TODO Seems to be nothing to pass
        });
    }

    /**
     * TODO
     * @param {function} callback
     */
    onNew(callback){
        this.service.on('notifications:new', function(data){
            /**
             * All notifications in list, both read and unread
             * TODO Convert to Notification Models
             * @type {Object[]}
             */
            var notifications = data.notifications;

            console.info('notifications:new', arguments);
            callback(notifications);
        });
    }
}

export default NotificationsRealtime;