import mongoose from 'mongoose'

const alertConfigs = new mongoose.Schema({
    code: { type: Number, required: true },
    tagString: { type: String, required: true },
    co2: { type: Number, required: true },
    humidity: { type: Number, required: true },
    temperature: { type: Number, required: true },
    tvoc: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('alerts', alertConfigs);