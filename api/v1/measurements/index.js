import Route from '~/src/structures/routes/Route.js'

export default class Measurements extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '';
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
     * @param {Request} request 
     */
    async get(request) {
        if (!this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);

        const tagString = searchParams.get('tagString');
        const delta = searchParams.get('delta');
        const start = searchParams.get('start');
        const end = searchParams.get('end');
        const fields = searchParams.get('fields');
        // Default mean to true so bandwidth load is saved
        const mean = searchParams.has('mean') ? (searchParams.get('mean') == "false" ? false : true) : false;
        // Combine data points
        const aggregate = searchParams.has('aggregate') ? searchParams.get('aggregate') : '5s';

        if (!tagString) return request.reject(400);

        let constraints = '';

        if (!start && !end) {
            const date = new Date();
            date.setMinutes(date.getMinutes() - (!delta || isNaN(delta) ? 10 : delta));

            constraints = `|> range(start: ${date.toISOString()})`;
        }
        else if (delta && (start || end)) return request.reject(400);
        else if (start && end) {
            if (isNaN(start) || isNaN(end)) return request.reject(400);

            const startDate = new Date(parseInt(start));
            const endDate = new Date(parseInt(end));

            constraints = `|> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})`;
        }

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
        `from(bucket: "${this.auth.influx_db.bucket}") ${constraints}
        |> filter(fn: (r) => r["_measurement"] =~ /${tagString}.*/)
        |> aggregateWindow(every: ${aggregate}, fn: mean, createEmpty: false)
        ${mean ? '|> yield(name: "mean")' : ''}`;

        return request.accept(
            await this.query(query)
        );
    }
}