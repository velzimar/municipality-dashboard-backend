const mongoose = require ('mongoose');
const fileconditionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    conditionfournie: {type: mongoose.Schema.Types.ObjectId, ref: 'Condition' , required: true},
    commentaire: {type: String},
    isSatisfied: {type: Boolean, required: true},
    numfile: {type: mongoose.Schema.Types.ObjectId, ref:'File', required: true}
})
module.exports = mongoose.model('Filecondition', fileconditionSchema)