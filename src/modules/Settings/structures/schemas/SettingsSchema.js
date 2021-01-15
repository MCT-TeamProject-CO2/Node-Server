import mongoose from 'mongoose'

const settings = new mongoose.Schema({
    id: { type: Number, required: true, default: 1 },
    config: {
        ppmThresholds: {
            0: { type: String, required: true, default: 900 },
            1: { type: String, required: true, default: 1500 }
        },
        disableNormalLogin: { type: Boolean, required: true, default: false }
    }
});

export default mongoose.model('settings', settings);