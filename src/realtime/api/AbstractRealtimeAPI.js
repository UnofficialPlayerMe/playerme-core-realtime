/**
 * @class Description of RealtimeService
 */
class AbstractRealtimeAPI {
    /**
     * @param {RealtimeService} realtimeService
     */
    constructor(realtimeService) {
        var className = this.constructor.name;
        if (className === 'AbstractRealtimeAPI'){
            throw new Error("AbstractRealtimeAPI is not supposed to be instantiated");
        }
        if (!realtimeService){
            throw new ReferenceError("realtimeService not passed to "+className);
        }

        /**
         * @member {RealtimeService}
         */
        this.service = realtimeService;
    }
}

export default AbstractRealtimeAPI;