import BaseModule from './structures/BaseModule.js'
import LocationModel from './structures/models/LocationModels.js'

export default class Locations extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Locations, {
            name: 'location',
            requires: [ 'mongo' ]
        });
    }

    get model() {
        return LocationModel;
    }
}