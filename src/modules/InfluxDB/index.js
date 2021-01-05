import BaseModule from './structures/BaseModule.js'
import { InfluxDB } from '@influxdata/influxdb-client'

export default class Influx extends BaseModule {
    _instance;

    constructor(main) {
        super(main);

        this.register(Influx, {
            name: 'db'
        });

        this._instance = new InfluxDB({ url: this.auth.influx_db.url, token: this.auth.influx_db.token });
    }

    read() {
        return this._instance.getQueryApi(this.auth.influx_db.organisation);
    }

    write(bucket, time_interval = 'ms') {
        return this._instance.getWriteApi(this.auth.influx_db.organisation, bucket, time_interval);
    }

    init() {
        this.log.info('INFLUX', 'Module initialized...');

        return true;
    }
}