const { createHmac, randombytes  } = require("crypto");
const { Schema, models } = require('mongoose');
const { stringify } = require("querystring");

userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "default.png"
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
},
 { timestamps: true }
);

userSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randombytes(16).tostring();
    const hashedPassword = createHmac('sha256', salt).toUpdate(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

const User = model('user', userSchema);

module.exports = User;