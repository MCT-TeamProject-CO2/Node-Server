import Route from '~/src/structures/routes/Route.js'

export default class Measurements extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/measurements';
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
        const searchParams = new URLSearchParams(request.searchParams);

        const tagString = searchParams.get('tagString');
        if (!tagString) return request.reject(400);

        let date = new Date();
        date.setMinutes(date.getMinutes() - 15);

        const query =
        `from(bucket: "c02")
        |> range(start: ${date.toISOString()})
        |> filter(fn: (r) => r["_measurement"] =~ /${tagString}.*/)`;

        return request.accept(
            await this.query(query)
        );
    }
}