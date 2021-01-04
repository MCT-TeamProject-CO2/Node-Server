import BaseModule from './structures/BaseModule.js'

export default class REST extends BaseModule {
    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        super(main);

        this.register(REST, {
            name: 'rest'
        });
    }

    /**
     * @returns {boolean} Return true if the init succeeded, false to exit the entire app
     */
    init() {
        this.log.info('REST', 'Started...');

        return true;
    }
}