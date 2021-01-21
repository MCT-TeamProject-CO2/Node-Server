import BaseModule from './structures/BaseModule.js'
import AlertModel from './structures/models/AlertModel.js'

export default class Alert extends BaseModule {
    _ready = false;
    ppmThresholds = [];

    constructor(main) {
        super(main);

        this.register(Alert, {
            name: 'alert',
            requires: [ 'influx', 'mongo' ],
            events: [
                {
                    mod: 'influx',
                    name: 'ready',
                    call: 'ready'
                },
                {
                    mod: 'mongo',
                    name: 'ready',
                    call: 'ready'
                }
            ]
        });
    }

    /**
     * @returns {AlertModel}
     */
    get model() {
        return AlertModel;
    }
 
    async calculateAlerts() {
        if (!this.modules.settings.ready) return setTimeout(this.calculateAlerts.bind(this), 10);
        const tresholds = this.modules.settings.cache.config.ppmThresholds;

        this.log.verbose('ALERTS', 'Calculating thresholds.');

        const locations = await this.modules.location.model.getAll();
        for (const location of locations) {
            for (const building of location.buildings) {
                for (const floor of building.floors) {
                    for (const room of floor.rooms) {
                        const tagString = location.tag+'.'+building.tag+'.'+floor.tag+'.'+room.tag;
                        const data = await this.get(tagString, 10, 'co2eq_ppm,humidity,temperature,tvoc_ppb');

                        if (data && data.co2eq_ppm) {
                            const ppm = data.co2eq_ppm;
                            let code = 0;

                            if (ppm >= tresholds.orange && ppm < tresholds.red) code = 1;
                            else if (ppm > tresholds.red) code = 2;

                            if (code !== 0) this.createAlert(tagString, code, data);
                            if (code == 2) await this.modules.smartplugs.toggle(tagString, true);
                            if (code !== 2) await this.modules.smartplugs.toggle(tagString, false);
                        }
                    }
                }
            }
        }

        setTimeout(this.calculateAlerts.bind(this), 3e5);
    }

    async createAlert(tagString, code, data) {
        const doc = (await this.model.getLatestAlertForTagstring(tagString))[0];

        if (doc) {
            const date = new Date(doc.createdAt);

            // Update if within the last 20 minutes
            if (date.getTime() > Date.now() - 12e5) {
                await this.model.updateId(doc._id, {
                    code,
    
                    co2: data.co2eq_ppm,
                    humidity: data.humidity,
                    temperature: data.temperature,
                    tvoc: data.tvoc_ppb
                });

                return;
            }
        }

        this.model.create({
            code,
            tagString,

            co2: data.co2eq_ppm,
            humidity: data.humidity,
            temperature: data.temperature,
            tvoc: data.tvoc_ppb
        });
    }

    query(query) {
        const readAPI = this.modules.influx.read();
        
        return new Promise((resolve, reject) => {
            const data = {};

            readAPI.queryRows(query, {
                next: (row, tableMeta) => {
                    const o = tableMeta.toObject(row);
                    
                    data[o._field] = o._value;
                },
                error: () => resolve(null),
                complete: () => resolve(data)
            });
        });
    }

    /**
     * 
     */
    async get(tagString, delta, fields) {
        let constraints = '';

        const date = new Date();
        date.setMinutes(date.getMinutes() - delta ? delta : 10);

        constraints = `|> range(start: ${date.toISOString()})`;

        if (fields) {
            const split = fields.split(',');

            constraints += '|> filter(fn: (r) =>';

            for (let i = 0; i < split.length; i++) {
                const field = split[i];
                
                if (i) constraints += ' or ';
                constraints += `r._field == "${field}"`;
            }

            constraints += ')';
        }

        const query =
        `from(bucket: "CO2")
        ${constraints}
        |> filter(fn: (r) => r["_measurement"] == "${tagString}")
        |> mean()`;

        return this.query(query);
    }

    ready() {
        if (this._ready) this.calculateAlerts();
        this._ready = true;
    }
}