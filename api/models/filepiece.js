const mongoose = require ('mongoose');
const filepieceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    piecefournie: {type: mongoose.Schema.Types.ObjectId, ref: 'Piece' , required: true},
    commentaire: {type: String},
    numfile: {type: mongoose.Schema.Types.ObjectId, ref:'File'},
    isSatisfied: {type: Boolean, required: true}
})
module.exports = mongoose.model('Filepiece', filepieceSchema)