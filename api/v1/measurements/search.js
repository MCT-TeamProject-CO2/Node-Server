import Route from '~/src/structures/routes/Route.js'

export default class MeasurementSearch extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/search';
    }
    
    query(query) {
        const readAPI = this.modules.influx.read();
        
        return new Promise((resolve, reject) => {
            const data = [];

            readAPI.queryRows(query, {
                next: (row, tableMeta) => {
                    const o = tableMeta.toObject(row);
                        
                    data.push(o._value);
                },
                error: reject,
                complete: () => resolve(data)
            });
        });
    }

    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);

        const search = searchParams.has('q') ? searchParams.get('q') : '';

        const results = await this.query(
            `import "influxdata/influxdb/v1"
            v1.measurements(bucket: "CO2")`
        );

        const result = results.filter(row => /[a-zA-Z]{3}\.[a-zA-Z]\.-?[0-9]*\.[0-9]{3}/.test(row) && row.includes(search));

        return request.accept(result);
    }
}