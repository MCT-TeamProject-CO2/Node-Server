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
        return '';
    }

    streamToBuffer(readable) {
        return new Promise((resolve, reject) => {
            const buff = [];

            readable.on('data', (d) => buff.push(d));
            readable.on('error', reject);
            readable.on('end', () => resolve(Buffer.concat(buff)));
        });
    }

    /**
     * This will parse the formdata in a naive way, do not reuse this code
     * @param {Request} request 
     */
    parseForm(request) {
        return new Promise((resolve, reject) => {
            const busboy = new Busboy({ headers: request.headers });
            const data = {};

            busboy.on('file', async (fieldname, file, filename,  encoding, mimetype) => {
                const buff = await this.streamToBuffer(file);

                if (fieldname.includes('[]')) {
                    fieldname = fieldname.replace('[]', '');
                    if (!data[fieldname]) data[fieldname] = [];

                    data[fieldname].push(buff);

                    return;
                }
                data[fieldname] = buff;
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
            busboy.on('finish', () => resolve(data));

            request.req.pipe(busboy);
        });
    }

    async delete(request) {
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        try {
            const location = await this.model.get(body);

            for (const floorPlan of location.floor_plans) 
                await this.model.deleteFloorPlan({ _id: floorPlan.id });

            await this.model.deleteLocation(body);
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }

        return request.accept('', 204);
    }

    /**
     * 
     * @param {Request} request 
     */
    async get(request) {
        if (!this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);
        const tag = searchParams.get('tag');

        if (tag) return request.accept(
            await this.model.get({ tag })
        );

        return request.accept(
            await this.model.getAll()
        );
    }

    /**
     * 
     * @param {Request} request 
     */
    async post(request) {
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        const formUpload = request.headers['content-type'].includes('multipart/form-data');
        if (formUpload) {
            const data = await this.parseForm(request);

            const locationSchema = {
                name: data['building-name'],
                tag: data['building-shortname'],
                floor_plans: []
            };

            for (let i = 0; data.floor && i < data.floor.length; i++) {
                const floorNum = data.floor[i];
                const floorPlan = data.floor_plan[i];
                
                if (floorPlan.length > 64) {
                    const floorPlanSchema = await this.model.createSvgDocument({
                        tag: floorNum,
                        svg: floorPlan
                    });

                    locationSchema.floor_plans.push({
                        tag: floorNum,
                        id: floorPlanSchema._id,
                    });
                }
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
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        const formUpload = request.headers['content-type'].includes('multipart/form-data');
        if (formUpload) {
            const data = await this.parseForm(request);

            const _id = data._id;
            const locationSchema = {
                name: data['building-name'],
                tag: data['building-shortname'],
                floor_plans: []
            };

            const location = await this.model.get({ _id }, 1);

            for (let i = 0; data.floor && i < data.floor.length; i++) {
                const floorNum = data.floor[i];
                const floorPlan = data.floor_plan[i];
                
                if (floorPlan.length > 64) {
                    let floorPlanSchema;

                    if (location.floor_plans[i])
                        floorPlanSchema = await this.model.updateSvgDocument({ _id: location.floor_plans[i].id }, {
                            tag: floorNum,
                            svg: floorPlan
                        });
                    else
                        floorPlanSchema = await this.model.createSvgDocument({
                            tag: floorNum,
                            svg: floorPlan
                        });

                    locationSchema.floor_plans.push({
                        tag: floorNum,
                        id: floorPlanSchema._id
                    });
                }
                else if (location.floor_plans[i]) {
                    locationSchema.floor_plans.push(location.floor_plans[i]);
                }
            }

            try {
                return request.accept(
                    await this.model.update({ _id }, locationSchema)
                );
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
}