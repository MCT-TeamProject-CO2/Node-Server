import BaseModule from './structures/BaseModule.js'
import LoggingModel from './structures/models/LoggingModel.js'

export default class Logging extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Logging, {
            name: 'logging',
            requires: [ 'mongo' ]
        });
    }

    get model() {
        return LoggingModel;
    }

    /**
     * @param {string} level
     * @param {string} type 
     * @param {string} message 
     * @param {Object} technical
     */
    push(level, type, message, technical) {
        return this.model.createNewLog({
            level,
            type, 
            message,
            technical
        });
    }
}