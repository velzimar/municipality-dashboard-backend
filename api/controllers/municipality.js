const mongoose = require("mongoose");
const Municipality = require("../models/municipality");





exports.municipalities_get_municipality = (req, res, next) => {
    const id = req.body.municipalityId;
    if(!id){
        Municipality.find()
        .select('_id name city governorate municipalityNumber creationDate updateDate')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch( err => {
            res.status(500).json({
                error : err
            });
        });
    }
    else{
        Municipality.find({_id : id})
        .select('_id city governorate municipalityNumber creationDate updateDate')
        .exec()
        .then( doc => {
            if(doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({
                   message : "No valid entry found for the given ID" 
                }) 
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
    }
};


exports.municipalities_create_municipality = (req, res, next) => {
    Municipality
    .find({city : req.body.city.toUpperCase() , governorate : req.body.governorate.toUpperCase()})
    .exec()
    .then(rs => {
        if(rs.length > 0){
            const error = new Error();
            error.governorate = 'Governorate already exists';
            error.city = 'Municipality already exists';
            
            
            return res.status(409).json(error);
        }
        else {
            let nbMunicipality = 0;
            Municipality.countDocuments().then(count=>{
                const municipality = new Municipality({
                    _id : new mongoose.Types.ObjectId(),
                    city : req.body.city.toUpperCase(),
                    governorate : req.body.governorate.toUpperCase(),
                    municipalityNumber: count
                });
                municipality
                .save()
                .then(result => {
                res.status(201).json({
                    message: "Created municipality successfully",
                    createdMunicipality: municipality
                });
                })
                .catch(err => {
                res.status(500).json({
                      error: err
                    });
                });

              }).catch(err=>{
                console.log(err);
              });;
            
        }})
        .catch(err => {
            res.status(500).json({
                error: err
                })
        });
};


exports.municipalities_delete_municipality = (req, res, next) => {
    const id = req.body.municipalityId;

    if(id){
        Municipality.deleteOne({ _id: id})
        .exec()
        .then( result => {
            res.status(200).json({
                message : "municipality deleted sucessfully"
            });
        })
        .catch( err => {
            res.status(500).json({
                error : err
            });
        });
    }
    else{
    res.status(400).json({
        error : "missing municipalityId"
    })
}
};

function upper(obj) {
    for (var prop in obj) {
    if (typeof obj[prop] === 'string') {
      obj[prop] = obj[prop].toUpperCase();
    }
    if (typeof obj[prop] === 'object') {
      upper(obj[prop]);
      }
    }
    return obj;
  }

exports.municipalities_patch_municipality= (req,res,next ) => 
{
    //lezem nriguel message li yerja3 lil  superadmin ki ya3ml update li haja kif id methalab meterja3louch
    //municipality updated
    const id = req.body.municipalityId;
    var props = req.body;
    props.updateDate = new Date();
    upper(props);
    //console.log(props);
    // USE findOneAndUpdate to get the object id
    Municipality.findOneAndUpdate({_id: id}, props,{useFindAndModify: false})
    .exec()
    .then(result => {
        //console.log(result);//this shows the object BEFORE the update
        res.status(200).json({
            message: "municipality updated successfully",
            id: result._id,
            city: (props.city!=null)?props.city:result.city,
            governorate: (props.governorate!=null)?props.governorate:result.governorate,
            municipalityNumber: (props.municipalityNumber!=null)?props.municipalityNumber:result.municipalityNumber,
            updateDate: props.updateDate
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            message: "fail to update municipality"
        })

    })

} 


exports.municipality_count_by_creationDate = (req, res, next) => {
    var date = req.body.creationDate;
    var day = new Date(date);
    console.log(day);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    console.log(nextDay);
    if (req.body.creationDate) {
        Municipality.find({ "creationDate": { "$gte": day, "$lt": nextDay } })//.countDocuments()
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "Count all municipalities created on " + date,
                    count: doc.length,
                    Municipalities: doc,
                    response: true
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Wrong date",
                    response: false
                })
            })
    } else {
        res.status(501).json({
            message: "Insert date",
            response: false
        })
    }
}


exports.municipality_count_inRangeDate = (req, res, next) => {
    var start = req.body.start;
    var end = req.body.end;
    var startDate = new Date(start);
    var endDatee = new Date(end);
    console.log(start);
    console.log(end);
    console.log(startDate);
    //console.log(endDate);
    var endDate = new Date(endDatee);
    endDate.setDate(endDatee.getDate() + 1);
    console.log(endDate);
    if (req.body.start && req.body.end) {
        Municipality.find({ "creationDate": { "$gte": startDate, "$lt": endDate } })//.countDocuments()
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "Count all municipalities created between " + start + " and " + end,
                    count: doc.length,
                    Municipalities: doc,
                    response: true
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Wrong date",
                    response: false
                })
            })
    } else {
        res.status(501).json({
            message: "Insert date start and/or date end",
            response: false
        })
    }
}