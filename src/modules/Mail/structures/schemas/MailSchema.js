import mongoose from 'mongoose'

const mailConfigs = new mongoose.Schema({
    name: { type: String, required: true, unique: true, default: "defaultConfig" },
    config: {
        pool: { type: Boolean, required: true },
        host: { type: String, required: true },
        port: { type: Number, required: true },
        secure: { type: Boolean, required: true },
        auth: {
            user: { type: String, required: true },
            pass: { type: String, required: true }
        }
    }
});

export default mongoose.model('mail', mailConfigs);