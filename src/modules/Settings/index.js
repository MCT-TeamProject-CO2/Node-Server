import BaseModule from './structures/BaseModule.js'
import SettingsModel from './structures/models/SettingsModel.js'

export default class Settings extends BaseModule {
    _cache = null;
    _ready = false;

    constructor(main) {
        super(main);

        this.register(Settings, {
            name: 'settings',
            requires: [ 'mongo' ], 
            events: [
                {
                    mod: 'mongo',
                    name: 'ready',
                    call: '_onReady'
                }
            ]
        });
    }

    get cache() {
        return this._cache;
    }

    get model() {
        return SettingsModel;
    }

    get ready() {
        return this._ready;
    }

    /**
     * @private
     */
    async _onReady() {
        if (await this.model.createIfNotExists())
            this.log.info('SETTINGS', 'Created settings object.');
        else
            this.log.verbose('SETTINGS', 'Settings object already exists, skipping...');

        await this.updateCache();

        this._ready = true;
    }

    /**
     * Updates the settings cache
     */
    async updateCache() {
        this._cache = await this.model.query();
    }
}