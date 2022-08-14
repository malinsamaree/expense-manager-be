import mongoose from "mongoose";

const payingAccountSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    default: {
        type: Boolean,
    }
});

const PayingAccount = mongoose.model('payingAccount', payingAccountSchema);

export {PayingAccount};