const mongoose = require("mongoose");
const Piece= require("../models/pieces");



exports.piece_create_piece = (req,res,next) => 
{
    Piece.find({description: req.body.pieceDescription})
    .exec()
    .then(rs => {
        if (rs.length > 0)
        {
            res.status(409).json({ message: "piece already exists"})
        }
        else
        {
            const piece = new Piece({
                _id: new mongoose.Types.ObjectId(),
                description: req.body.pieceDescription
                
            });
            piece.save()
            .then(result => 
                    {
                    res.status(201).json({
                        message: 'piece created successfully',
                        createdPiece: piece
                    })
                })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
            
            
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })

}



exports.piece_delete_piece = (req,res,next) =>
{
    const id = req.body.pieceId;
    if (id)
    {
        Piece.remove({_id: id})
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: "Piece deleted successfully"
                })
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

    }
    else 
    {
        res.status(400).json({
            message: 'Missing piece Id'
        })
    }
}

exports.piece_deleteall_piece = (req,res,next) =>
{
   
        Piece.remove({workflow: null})
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: "Piece deleted successfully"
                })
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.piece_getall_piece = (req,res,next) =>
{
    Piece.find({workflow: null})
    .select('_id description workflow')
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}