import { stringToLines } from '@influxdata/influxdb-client';
import mongoose from 'mongoose'

const room = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    position: {
        x: Number,
        y: Number
    }
});

const floor = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    rooms: [room]
});

const building = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    floors: [floor]
});

const location = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true, unique: true },
    buildings: [building]
});

export default mongoose.model('locations', location);