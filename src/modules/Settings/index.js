import BaseModule from './structures/BaseModule.js'
import SettingsModel from './structures/models/SettingsModel.js'

export default class Settings extends BaseModule {

    constructor(main) {
        super(main);

        this.register(Settings, {
            name: 'settings',
            requires: [ 'mongo' ], 
            events: [
                {
                    mod: 'mongo',
                    name: 'ready',
                    call: 'createSettings'
                }
            ]
        });
    }

    get model() {
        return SettingsModel;
    }

    async createSettings() {
        if (await this.model.createIfNotExists())
            this.log.info('SETTINGS', 'Created settings object.');
        else
            this.log.verbose('SETTINGS', 'Settings object already exists, skipping...');
    }
}