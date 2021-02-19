import cluster from 'cluster'
import os from 'os'
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

    /**
     * 
     * @param {*} worker 
     * @param {*} code 
     * @param {*} signal 
     */
    onSlaveExit(worker, code , signal) {
        this.log.critical('CLUSTER', `Worker "${worker.process.pid}" died`);
    }

    start() {
        if (cluster.isMaster) {
            this.log.info('CLUSTER', 'Master has started.');

            const forks = this.config.development ? 1 : os.cpus().length;
            for (let i = 0; i < forks; i++)
                cluster.fork();

            cluster.on('exit', this.onSlaveExit.bind(this));
            return;
        }

        this.log.info('CLUSTER', `Slave has started PID ${process.pid}`);

        this._modulesManager.load();
    }
}