const mongoose = require("mongoose");
const Step= require("../models/steps");



exports.step_create_step = (req,res,next) => 
{
    Step.find({description: req.body.stepDescription})
    .exec()
    .then(rs => {
        if (rs.length > 0)
        {
            res.status(409).json({ message: "step already exists"})
        }
        else
        {
            const step = new Step({
                _id: new mongoose.Types.ObjectId(),
                description: req.body.stepDescription,
                stepOrder: req.body.stepOrder
            });
            step.save()
            .then(result => 
                    {
                    res.status(201).json({
                        message: 'step created successfully',
                        createdPiece: step 
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



exports.step_delete_step = (req,res,next) =>
{
    const id = req.body.stepId;
    if (id)
    {
        Step.remove({_id: id})
        .exec()
        .then(result => {
                res.status(200).json({
                    message: "Step deleted successfully"
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
            message: 'Missing step Id'
        })
    }
}

exports.step_deleteall_step = (req,res,next) =>
{
    
        Step.remove({workflow: null})
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: "Step deleted successfully"
                })
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

   
}


exports.step_getall_step = (req,res,next) =>
{
    Step.find({workflow: null})
    .select('_id description workflow')
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}