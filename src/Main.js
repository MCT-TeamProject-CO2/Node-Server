import ModuleManager from './managers/Modules.js'
import log from './util/Log.js'

export default class Main {
    _modulesManager = new ModuleManager(this);
    log = log;

    constructor() {
        
    }

    start() {
        this._modulesManager.load();
    }
}