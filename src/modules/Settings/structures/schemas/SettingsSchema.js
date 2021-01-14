import mongoose from 'mongoose'

const settings = new mongoose.Schema({
    id: { type: number, required: true, default: 1 },
    config: {
        ppmThresholds: {
            0: { type: String, required: true, default: 900 },
            1: { type: String, required: true, default: 1500 }
        },
        disableNormalLogin: {type: boolean, required: true, default: false}
    }
});

export default mongoose.model('settings', settings);