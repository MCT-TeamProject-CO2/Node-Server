import ModuleManager from './managers/Modules.js'
import log from './util/Log.js'
import config from '~/data/config.js'

export default class Main {
    _modulesManager = new ModuleManager(this);

    constructor() {
        Object.assign(this, {
            config,
            log
        });
    }

    start() {
        this._modulesManager.load();
    }
}