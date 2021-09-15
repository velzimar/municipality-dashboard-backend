const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: { type: String, required: true},
    municipality: {type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required: true}, 
    numberOfAgents: {type: Number, required: true},
    superadmin:{type:Boolean, default:false, required:true},
    creationDate:{type: Date, required: true, default: Date.now},
    lastLoginDate:{type: Date, default:Date.now},
});

module.exports = mongoose.model('Admin', adminSchema);