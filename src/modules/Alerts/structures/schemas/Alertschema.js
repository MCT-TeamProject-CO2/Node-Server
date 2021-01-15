import mongoose from 'mongoose'

const alertConfigs = new mongoose.Schema({
    time: { type: Date, required: true },
    tagString: { type: String, required: true },
    ppm: { type: Number, required: true },
    code: { type: Number, required: true }
});

export default mongoose.model('alert', alertConfigs);