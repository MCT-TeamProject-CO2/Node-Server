import ModuleManager from './managers/Modules.js'
import log from './util/Log.js'
import auth from '~/data/auth.js'
import config from '~/data/config.js'

export default class Main {
    _modulesManager = new ModuleManager(this);

    constructor() {
        Object.assign(this, {
            auth,
            config,
            log
        });
    }

    /**
     * @returns {ModuleManager}
     */
    get modules() {
        return this._modulesManager;
    }

    start() {
        this._modulesManager.load();
    }
}