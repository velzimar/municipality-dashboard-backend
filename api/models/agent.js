const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: { 
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    login: {type: String, required: true},
    password: { type: String, required: true},
    municipality: {type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required:true}, 
    agentNumber: {type: Number, required: true},
    enabled: {type: Boolean, default: true},
    creationDate:{type: Date, required: true, default: Date.now},
    lastLoginDate:{type: Date, default:Date.now},
});

module.exports = mongoose.model('Agent', agentSchema);