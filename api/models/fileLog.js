const mongoose = require('mongoose');
const fileLogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    updated:{type: String, enum:["file","piece","condition"], required:true, default:"file"},
    file: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'File'},
    agent: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Agent'},
    updateDate:{type: Date, required: true, default: Date.now},
    oldFields:{type: Object},
    newFields:{type: Object},
 })

module.exports = mongoose.model('FileLog',fileLogSchema);