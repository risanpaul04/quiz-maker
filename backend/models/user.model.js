import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'editor', 'user'],
        default: 'user'
    },

    refreshTokens: [{
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: true
        },

        userAgent: String,
        ipAddress: String
    }],

    maxSessions: {
        type: Number,
        default: 2
    }


}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;