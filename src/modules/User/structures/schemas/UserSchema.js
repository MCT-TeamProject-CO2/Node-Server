import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { AccountTypes, PermissionLevels, SaltRounds } from '../../util/Constants.js'
import bcrypt from 'bcrypt'

const users = new mongoose.Schema({
    uid: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: AccountTypes },
    phone_number: { type: String, unique: true, sparse: true },
    disabled: { type: Boolean, default: false },
    username: { type: String, unique: true, sparse: true },
    permission: { type: String, enum: PermissionLevels, default: 'info'},
    password: String,
    config: {
        mailNotifications: { type: Boolean, default: false },
        smsNotifications: { type: Boolean, default: false}
    }
});

users.pre('save', async function() {
    if (this.password)
        this.password = await bcrypt.hash(this.password, SaltRounds);
});
users.pre('findOneAndUpdate', async function() {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, SaltRounds);
    }
});

export default mongoose.model('users', users);