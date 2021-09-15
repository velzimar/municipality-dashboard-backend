const mongoose = require('mongoose');

const conditionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {type: String, required: true},
    workflow: {type: mongoose.Schema.Types.ObjectId, ref: 'Workflow',  default: null},
    //creationDate:{type: Date, required: true, default: Date.now},
});
module.exports = mongoose.model('Condition', conditionSchema);