const Filecondition = require('../models/filecondition');
const mongoose = require('mongoose');
const fileLog = require("../models/fileLog");


exports.filecondition_create_filecondition = (req,res,next) => {
    Filecondition.find({numfile: req.body.numfile} && {conditionfournie: req.body.conditionfournie})
    .exec()
    .then( rs => {
        if (rs.length > 0)
        {res.status(409).json(
            {message: 'condition and comment  already exists for this file '}
            )
        }
        else
        {
            const filecondition = new Filecondition({
                _id: new mongoose.Types.ObjectId(),
                conditionfournie: req.body.conditionfournie,
                commentaire: req.body.commentaire,
                isSatisfied: req.body.isSatisfied,
                numfile: req.body.numfile
            })
            filecondition.save()
            .then(result => {
                res.status(200).json({
                    message: 'condition and comment created successfully for the file ' + filecondition.numfile,
                    filecondition: filecondition
                })
                 })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
        }
            }
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}
/*
exports.filecondition_update_filecondition=(req,res,next) => 
{
    const id = req.body.fileconditionId ;
    const props = req.body
    Filecondition.update({_id: id}, props)
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({message: 'condition updated successfully for the file '})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}
*/

exports.filecondition_update_filecondition=(req,res,next) => 
{
    if(req.body.agent && req.body.file && req.body._id){
    const id = req.body._id;
    const agent = req.body.agent;
    const file = req.body.file;
    const props = req.body
    Filecondition.findOneAndUpdate({_id: id, numfile:file}, props,{useFindAndModify:false})
    .select('commentaire isSatisfied -_id')
    .exec()
    .then(result => {
        delete props.agent
        delete props._id
        delete props.file
        const log = new fileLog({
            _id: new mongoose.Types.ObjectId(),
            agent:agent,
            file: file,
            updated: "condition",
            oldFields: result,
            newFields: props,
            updateDate: new Date()
        })
        log.save()
        .then((ress) => {
            res.status(201).json({
              message: "Created filelog successfully",
              log: ress,
              message: "filecondition updated successfully",
            });
          })
          .catch((err) => {
            res.status(501).json({
              error: err,
            });
          });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}else{
    res.status(550).json({
        message: "Insert agentId and fileId and fileconditionId",
      }); 
}
}

exports.filecondition_get_filecondition=(req,res,next) => {
    const id = req.body.fileconditionId 
    if (!id) 
    {
        Filecondition.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs)
             })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    }
    else
    {
        Filecondition.find({_id: id})
        .exec()
        .then(doc => {
            res.status(200).json(doc)
             })
             .catch(err => {
                console.log(err)
                res.status(500).json({error: err})
            })
    }
    
    
}

exports.filecondition_get_filecondition_byFile=(req,res,next) => {
    const id = req.body.fileId 
    if (!id) 
    {
        Filecondition.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs)
             })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    }
    else
    {
        Filecondition.find({numfile: id})
        .select('-numfile')
        .exec()
        .then(doc => {
            res.status(200).json({file:id,doc:doc})
             })
             .catch(err => {
                console.log(err)
                res.status(500).json({error: err})
            })
    }
}