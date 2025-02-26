const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    age: { type: Number, required: true },
    blood_group: { type: String },
    type: { type: String, enum: ["child", "mother", "father", "teacher"], required: true },
    email: { 
        type: String, 
        required: true, 
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] 
    },
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);
