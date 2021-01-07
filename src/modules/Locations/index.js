import BaseModule from './structures/BaseModule.js'

export default class Locations extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Locations, {
            name: 'location'
        });
    }
}