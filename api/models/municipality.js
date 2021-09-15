const mongoose = require("mongoose");
const municipalitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    city : { type: String, required: true },
    governorate: { type: String, required: true },
    municipalityNumber: {type: Number, required: true},
    creationDate:{type: Date, required: true, default: Date.now},
    updateDate:{type: Date, required: true, default: Date.now},
  
});
module.exports = mongoose.model('Municipality', municipalitySchema);
    



