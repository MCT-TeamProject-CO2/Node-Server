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

    get models() {
        return SettingsModel;
    }

    createSettings() {
        this.models.createIfNotExists();
    }
}