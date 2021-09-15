const mongoose = require('mongoose');

const stepSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {type: String, required: true},
    workflow: {type: mongoose.Schema.Types.ObjectId, ref: 'Workflow',  default: null},
    stepOrder: {type: Number, required: true}
    //creationDate:{type: Date, required: true, default: Date.now},

});

module.exports = mongoose.model('Step', stepSchema);