const mongoose = require('mongoose');

const workflowSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    municipality: {type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required:false},
    title: {type: String, required:true, unique:true},
    description : {type : String, required:true},
    conditions : [{type: mongoose.Schema.Types.ObjectId, ref: 'Condition'}],
    pieces: [{type: mongoose.Schema.Types.ObjectId, ref: 'Piece'}],
    steps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Step'}],
    depot: {type: String},
    creationDate:{type: Date, required: true, default: Date.now}

}); 

module.exports = mongoose.model('Workflow', workflowSchema);