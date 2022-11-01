const mongoose = require('mongoose');
const argon = require('argon2');

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: [true, "user name is required"] },
    password: { type: String, min: [8, "password must be at least 8 chars"], required: [true, "password is required"] },
    slug: { type: String, lowercase: true },
    email: { type: String, required: [true, "user email is required"], unique: true },
    phone: String,
    profileImg: String,
    password_updated_at: Date,
    role: {
        type: String,
        enum: ["user", "supervisor", "admin"],
        default: "user"
    },
    is_active: { type: Boolean, default: true }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    this.password = await argon.hash(this.password);
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;