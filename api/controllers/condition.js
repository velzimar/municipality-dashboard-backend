const mongoose = require("mongoose");
const Condition = require("../models/conditions");



exports.condition_create_condition = (req,res,next) => 
{
    Condition.find({description: req.body.conditionDescription})
    .exec()
    .then(rs => {
        if (rs.length > 0)
        {
            res.status(409).json({ message: "Condition already exists"})
        }
        else
        {
            const condition = new Condition({
                _id: new mongoose.Types.ObjectId(),
                description: req.body.conditionDescription
            });
            condition.save()
            .then(result => 
                    {
                    res.status(201).json({
                        message: 'condition created successfully',
                        createdCondition: condition
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



exports.condition_delete_condition = (req,res,next) =>
{
    const id = req.body.conditionId;
    if (id)
    {
        Condition.remove({_id: id})
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: "Condition deleted successfully"
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
            message: 'Missing condition Id'
        })
    }
}
exports.condition_deleteall_condition = (req,res,next) =>
{
    
    
        Condition.remove({workflow: null})
        .exec()
        .then(
            result => {
                res.status(200).json({
                    message: "Condition deleted successfully"
                })
            }
        )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.condition_getall_condition = (req,res,next) =>
{
    Condition.find({workflow: null})
    .select('_id description workflow')
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}