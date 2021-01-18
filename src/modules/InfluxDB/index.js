import EventModule from './structures/EventModule.js'
import { InfluxDB } from '@influxdata/influxdb-client'

export default class Influx extends EventModule {
    _instance;

    constructor(main) {
        super(main);

        this.register(Influx, {
            name: 'influx'
        });
    }

    read() {
        return this._instance.getQueryApi(this.auth.influx_db.organisation);
    }

    write(bucket, time_interval = 'ms') {
        return this._instance.getWriteApi(this.auth.influx_db.organisation, bucket, time_interval);
    }

    init() {
        this._instance = new InfluxDB({ url: this.auth.influx_db.url, token: this.auth.influx_db.token });

        this.log.info('INFLUX', 'Module initialized...');

        this.emit('ready');

        return true;
    }
}