import Route from '~/src/structures/routes/Route.js'
import Busboy from 'busboy'

export default class Location extends Route {
    constructor(main) {
        super(main);
    }

    get model() {
        return this.modules.location.model;
    }

    get route() {
        return '/locations';
    }

    /**
     * This will parse the formdata in a naive way, do not reuse this code
     * @param {Request} request 
     */
    parseForm(request) {
        return new Promise((resolven, reject) => {
            const busboy = new Busboy({ headers: request.headers });
            const data = {};

            busboy.on('file', async (fieldname, file, filename,  encoding, mimetype) => {
                const string = await request.body(file);

                if (fieldname.includes('[]')) {
                    fieldname = fieldname.replace('[]', '');
                    if (!data[fieldname]) data[fieldname] = [];

                    data[fieldname].push(string);

                    return;
                }
                data[fieldname] = string;
            });
            busboy.on('field', (fieldname, value, fieldNameTrunc, valueTrunc, encoding, mimetype) => {
                if (fieldname.includes('[]')) {
                    fieldname = fieldname.replace('[]', '');
                    if (!data[fieldname]) data[fieldname] = [];

                    data[fieldname].push(value);

                    return;
                }
                data[fieldname] = value;
            });
            busboy.on('finish', () => resolven(data));

            request.req.pipe(busboy);
        });
    }

    /**
     * 
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        return request.accept(
            await this.model.getAll()
        );
    }

    /**
     * 
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const formUpload = request.headers['content-type'].includes('multipart/form-data');
        if (formUpload) {
            const data = await this.parseForm(request);

            const locationSchema = {
                name: data['building-name'],
                tag: data['building-shortname'],
                floor_plans: []
            };

            for (let i = 0; i < data.floor.length; i++) {
                const floorNum = data.floor[i];
                const floorPlan = data.floor_plan[i];
                
                locationSchema.floor_plans.push({
                    tag: floorNum,
                    svg: floorPlan,
                });
            }

            try {
                await this.model.createIfNotExists(locationSchema);
            } catch (error) {
                return request.reject(406, {
                    code: 406,
                    status: "406 - Not Acceptable",
                    message: error.message
                });
            }
        }
        else {
            const body = await request.json();
            if (!body) return request.reject(400);

            try {
                await this.model.createIfNotExists(body);
            } catch (error) {
                return request.reject(406, {
                    code: 406,
                    status: "406 - Not Acceptable",
                    message: error.message
                });
            }
        }
        return request.accept('', 201);
    }

    /**
     * 
     * @param {Request} request 
     */
    async put(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body || !body.query || !body.update) return request.reject(400);

        try {
            return request.accept(
                await this.model.update(body.query, body.update)
            );
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }
}