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
    password: String
});

users.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, SaltRounds);
});
users.pre('findOneAndUpdate', async function() {
    if (this._update.password) {
        if (!this._update.old_password) throw new Error('There was no "old_password" key found to verify the update to the user.');

        const docToUpdate = await this.model.findOne(this.getQuery());

        if (!await bcrypt.compare(this._update.old_password, docToUpdate.password)) throw new Error('Password not updated, the given old password did not match what was stored.');
    
        delete this._update.old_password;
        this._update.password = await bcrypt.hash(this._update.password, SaltRounds);
    }
});

export default mongoose.model('users', users);