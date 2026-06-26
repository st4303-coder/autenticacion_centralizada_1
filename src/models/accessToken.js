const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true
});
module.exports = mongoose.model('AccessToken', accessTokenSchema);