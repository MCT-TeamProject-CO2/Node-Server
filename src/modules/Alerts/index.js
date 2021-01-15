import BaseModule from './structures/BaseModule.js'
import AlertModel from './structures/models/AlertModel.js'

export default class Alert extends BaseModule {
    ppmThresholds = [];

    constructor(main) {
        super(main);

        this.register(Alert, {
            disabled: true,

            name: 'alert',
            requires: [ 'mongo' ]
        });
    }

    get models() {
        return AlertModel;
    }
 
    calculateAlerts(){

        

        for (let location in locations) {
            for (let building in location) {
                for (let floor in building) {
                    for (let room in floor) {
                        let tagString = location.name+'.'+building.name+'.'+floor.name+'.'+room.name;
                        let data = this.get(tagString, 10, 'co2eq_ppm')._result

                        // NOG AFWERKEN ============================================================================================
                        if(data._value > 200){
                            this.log.Info('alerts', 'data works');
                        }
                    }
                }
            }
        }
    }


    query(query) {
        const readAPI = this.modules.influx.read();
        
        return new Promise((resolve, reject) => {
            const data = {};

            readAPI.queryRows(query, {
                next: (row, tableMeta) => {
                    const o = tableMeta.toObject(row);

                    if (!data[o._measurement])
                        data[o._measurement] = [];
                        
                    data[o._measurement].push(o);
                },
                error: reject,
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
        `from(bucket: "c02") ${constraints}
        |> filter(fn: (r) => r["_measurement"] =~ /${tagString}.*/)
        |> mean()`;

        return this.query(query)
    }

    init() {
        setInterval(() => {
            calculateAlerts(); 
        }, 5*60000); // minutes*60000 to get milliseconds

        return true;
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