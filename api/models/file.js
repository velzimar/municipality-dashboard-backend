const mongoose = require('mongoose');
const fileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    workflow: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Workflow'},
    agent: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Agent'},
    nomcitoyen: {type: String, required: true},
    prenomcitoyen: {type: String, required: true},
    emailcitoyen: { 
        type: String,
        default: null,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    creationDate:{type: Date, required: true},
    lastUpdateDate:{type: Date, required: true},
    currentStatus: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Step'}
 })

module.exports = mongoose.model('File',fileSchema);