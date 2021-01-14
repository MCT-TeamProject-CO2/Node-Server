import mongoose from 'mongoose'

const alertConfigs = new mongoose.Schema({
    time: {type: date, required: true},
    tagString: { type: String, required: true},
    ppm: {type: number, required: true},
    code: {type: number, required: true}
});

export default mongoose.model('alert', alertConfigs);