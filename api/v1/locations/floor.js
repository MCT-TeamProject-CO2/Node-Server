import Route from '~/src/structures/routes/Route.js'

export default class Floor extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/floor';
    }

    get model() {
        return this.modules.location.model;
    }

    async delete(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body || !body.tag || !body.floor) return request.reject(400);

        const location = await this.model.get({ tag: body.tag });
        if (!location) return request.accept({ success: false });

        let _id;
        const floor_plans = location.floor_plans.filter(floorPlan => {
            if (floorPlan.tag == body.floor) {
                _id = floorPlan.id;

                return false;
            }
            return true;
        });

        try {
            await this.model.update({ _id: location._id }, { floor_plans });
            await this.model.deleteFloorPlan({ _id });
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }

        return request.accept({ success: true });
    }
}