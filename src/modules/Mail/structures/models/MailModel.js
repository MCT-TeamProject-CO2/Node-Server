import MailConfig from '../schemas/MailSchema.js'

/**
 * Creates a new document if it doesn't exist.
 * @param {{
 *  name: string,
 *  config: {
 *      pool: boolean,
 *      host: string,
 *      port: number,
 *      secure: boolean,
 *      auth: {
 *          user: string,
 *          pass: string
 *      }
 *  }
 * }} mailConfig
 * @returns {boolean} True if a new document was created, false if one already exists.
 */
export const createIfNotExists = async (mailConfig) => {
    const doc = await MailConfig.findOne({ name: mailConfig.name }).exec();
    if (!doc) {
        await new MailConfig(mailConfig).save();
        
        return true;
    }
    return false;
};

export const remove = (q) => {
    return MailConfig.findOneAndDelete(q).exec();
};

/**
 * 
 * @param {Object} q 
 */
export const query = (q) => {
    return MailConfig.find(q).exec();
};

export default {
    createIfNotExists,
    remove,
    query
};