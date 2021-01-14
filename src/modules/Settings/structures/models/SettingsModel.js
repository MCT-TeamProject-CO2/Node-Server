import SettingsSchema from '../schemas/MailSchema.js'

/**
 * Creates a new document if it doesn't exist.
 * @param {{
 *  id: number,
 *  config: {
 *      ppmThresholds: {
 *          0: number,
 *          1: number,
 *      },
 *      disableNormalLogin: boolean,
 *  }
 * }} settings
 * @returns {boolean} True if a new document was created, false if one already exists.
 */
export const createIfNotExists = async (settings) => {
    const doc = await SettingsSchema.findOne({}).exec();
    if (!doc) {
        await new SettingsSchema(settings).save();
        
        return true;
    }
    return false;
};


/**
 * Find the config document and update it with an object
 * @param {SettingsSchema} update 
 */
export const update = (update) => {
    return SettingsSchema
        .findOneAndUpdate({id: 1}, update, { new: true })
        .exec();
};

/**
 * 
 */
export const query = () => {
    return SettingsSchema.find({ id: 1 }).exec();
};

export default {
    createIfNotExists,
    update,
    query
};