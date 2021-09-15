const Filepiece = require('../models/filepiece');
const mongoose = require('mongoose');
const fileLog = require("../models/fileLog");


exports.filepiece_create_filepiece = (req,res,next) => {
    Filepiece.find({numfile: req.body.numfile} && {piecefournie: req.body.piecefournie})
    .exec()
    .then( rs => {
        if (rs.length > 0)
        {res.status(409).json(
            {message: 'pieces and comments table already exists for this file '}
            )
        }
        else
        {
            const filepiece = new Filepiece({
                _id: new mongoose.Types.ObjectId(),
                piecefournie: req.body.piecefournie,
                commentaire: req.body.commentaire,
                isSatisfied: req.body.isSatisfied,
                numfile: req.body.numfile
            })
            filepiece.save()
            .then(result => {
                res.status(200).json({
                    message: 'piece and comment created successfully for the file ' + filepiece.numfile,
                    filepiece: filepiece
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
exports.filepiece_update_filepiece=(req,res,next) => 
{
    const id = req.body.filepieceId ;
    const props= req.body
    Filepiece.update({_id: id},props)
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({message: 'piece updated successfully for this file '})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })
}
*/
exports.filepiece_get_filepiece=(req,res,next) => {
    const id = req.body.filepieceId 
    if (!id) 
    {
        Filepiece.find()
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
        Filepiece.find({_id: id})
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

exports.filepiece_get_filepiece_ByFile=(req,res,next) => {
    const id = req.body.fileId 
    if (!id) 
    {
        Filepiece.find()
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
        Filepiece.find({numfile: id})
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


exports.filepiece_update_filepiece=(req,res,next) => 
{
    if(req.body.agent && req.body.file && req.body._id){
    const id = req.body._id;
    const agent = req.body.agent;
    const file = req.body.file;
    const props = req.body
    Filepiece.findOneAndUpdate({_id: id, numfile:file}, props,{useFindAndModify:false})
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
            updated: "piece",
            oldFields: result,
            newFields: props,
            updateDate: new Date()
        })
        log.save()
        .then((ress) => {
            res.status(201).json({
              message: "Created filelog successfully",
              log: ress,
              message: "filepiece updated successfully",
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
        message: "Insert agentId and fileId and filepieceId",
      }); 
}
}