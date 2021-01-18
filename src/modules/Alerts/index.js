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

    get models() {
        return AlertModel;
    }
 
    async calculateAlerts() {
        const locations = await this.modules.location.model.getAll();
        for (const location of locations) {
            for (const building of location.buildings) {
                for (const floor of building.floors) {
                    for (const room of floor.rooms) {
                        const tagString = location.tag+'.'+building.tag+'.'+floor.tag+'.'+room.tag;
                        const data = await this.get(tagString, 10, 'co2eq_ppm');

                        console.log(data);
                    }
                }
            }
        }

        setTimeout(this.calculateAlerts.bind(this), 3e5);
    }


    query(query) {
        const readAPI = this.modules.influx.read();
        
        return new Promise((resolve, reject) => {
            const data = [];

            readAPI.queryRows(query, {
                next: (row, tableMeta) => {
                    const o = tableMeta.toObject(row);
                    data.push(o);
                },
                error: reject,
                complete: () => resolve(data[0])
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
        `from(bucket: "CO2") ${constraints}
        |> filter(fn: (r) => r["_measurement"] =~ /${tagString}.*/)
        |> mean()`;

        return this.query(query)
    }

    ready() {
        if (this._ready) this.calculateAlerts();
        this._ready = true;
    }
}


// {
//     "BCE.C.0.003": [
//         {
//             "result": "_result",
//             "table": 0,
//             "_start": "2021-01-14T19:10:08.979Z",
//             "_stop": "2021-01-14T19:11:08.994243142Z",
//             "_time": "2021-01-14T19:10:12Z",
//             "_value": 445,
//             "_field": "co2eq_ppm",
//             "_measurement": "BCE.C.0.003"
//         },
//         {
//             "result": "_result",
//             "table": 0,
//             "_start": "2021-01-14T19:10:08.979Z",
//             "_stop": "2021-01-14T19:11:08.994243142Z",
//             "_time": "2021-01-14T19:10:17Z",
//             "_value": 452,
//             "_field": "co2eq_ppm",
//             "_measurement": "BCE.C.0.003"
//         },