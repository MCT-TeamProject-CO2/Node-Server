import LocationSchema from '../schemas/LocationSchema.js'

export const createIfNotExists = (location) => {
    return new LocationSchema(location).save();
};

/**
 * Return all documents that match a query
 * @param {Object} q 
 * @returns {Promise<Array<LocationSchema>>}
 */
export const getAll = (q = {}) => {
    return LocationSchema.find(q).exec();
};

/**
 * 
 * @param {string} string 
 */
export const getRoomForTagString = async (tagString) => {
    // Location.Building.Floor.Room
    // KWE.A.0.104

    const [ location, building, floor, room ] = tagString.split('.');

    let data = await LocationSchema.findOne({
        tag: location
    }).exec();

    const obj = { location: data.name };

    data = data.buildings.find((el) => el.tag == building);
    obj.building = data.name;

    data = data.floors.find((el) => el.tag == floor);
    obj.floor = data.name;

    const { tag, name, position } = data.rooms.find((el) => el.tag == room)

    return Object.assign(obj, { tag, name, position }, { tagString });
};

/**
 * @param {Object} q
 * @param {LocationSchema} location 
 * @param {boolean} upsert If the document should be create if it isn't found
 * @returns {Promise<LocationSchema>}
 */
export const update = (q, location) => {
    return LocationSchema.findOneAndUpdate(q, location, { new: true }).exec();
};

export default {
    createIfNotExists,
    getAll,
    getRoomForTagString,
    update
};