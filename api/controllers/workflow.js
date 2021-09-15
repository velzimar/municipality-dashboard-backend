const mongoose = require('mongoose');
const Workflow = require("../models/workflow");
const Condition = require("../models/conditions");
const Step = require("../models/steps");
const Piece = require("../models/pieces");


exports.workflow_create_workflow = (req, res, next) => {
    Workflow.find({ title: req.body.title })
        .exec()
        .then(result => {
            if (result.length > 0) { res.status(401).json({ message: "workflow already exists" }) }
            else {
                const workflow = new Workflow({
                    _id: new mongoose.Types.ObjectId(),
                    municipality: req.body.municipality,
                    title: req.body.title,
                    description: req.body.description,
                    conditions: req.body.conditions, //array of conditions ID
                    pieces: req.body.pieces,  //array of pieces ID
                    steps: req.body.steps,     //array of steps ID
                    depot: req.body.depot
                });
                workflow.save()
                    .then(result => {
                        console.log(result);
                        for (conditionId in req.body.conditions) {
                            console.log(conditionId)
                            Condition.update({ _id: req.body.conditions[conditionId] }, { workflow: workflow._id })
                                .exec()
                                .then(rs => {
                                    console.log(rs)
                                    // res.status(200).json({
                                    //  message: "conditionId Updated"
                                    // })

                                })
                                .catch(err => {
                                    console.log(err);

                                })

                        }
                        for (pieceId in req.body.pieces) {
                            Piece.update({ _id: req.body.pieces[pieceId] }, { workflow: workflow._id })
                                .exec()
                                .then(rs => {
                                    console.log(rs)
                                    // res.status(200).json({
                                    //message: "pieceId Updated"
                                    // })

                                })
                                .catch(err => {
                                    console.log(err);

                                })

                        }
                        for (stepId in req.body.steps) {
                            Step.update({ _id: req.body.steps[stepId] }, { workflow: workflow._id })
                                .exec()
                                .then(rs => {
                                    console.log(rs);
                                    //  res.status(200).json({
                                    //message: "stepId Updated"
                                    // })

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                        res.status(200).json({
                            message: 'workflowId is ' + workflow._id
                        })

                    }
                    )
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });

                    })

            }
        })
}
// insert many workflows (test)  (we don't need to create many workflows )
exports.workflow_create_workflows = (req, res, next) => {
    Workflow.find({ title: "aaa" })
        .exec()
        .then(result => {
            if (result.length > 0) { res.status(401).json({ message: "workflow already exists" }) }
            else {
                let list = req.body;
                list.forEach(element => {
                    const workflow = new Workflow({
                        _id: new mongoose.Types.ObjectId(),
                        category: element.category,
                        municipality: element.municipality,
                        title: element.title,
                        description: element.description,
                        conditions: element.conditions, //array of conditions ID
                        pieces: element.pieces,  //array of pieces ID
                        steps: element.steps,     //array of steps ID
                        depot: element.depot
                    });
                    workflow.save()
                        .then(result => {
                            console.log(result);
                            for (conditionId in element.conditions) {
                                console.log(conditionId)
                                Condition.update({ _id: element.conditions[conditionId] }, { workflow: workflow._id })
                                    .exec()
                                    .then(rs => {
                                        console.log(rs)
                                        // res.status(200).json({
                                        //  message: "conditionId Updated"
                                        // })

                                    })
                                    .catch(err => {
                                        console.log(err);

                                    })

                            }
                            for (pieceId in element.pieces) {
                                Piece.update({ _id: element.pieces[pieceId] }, { workflow: workflow._id })
                                    .exec()
                                    .then(rs => {
                                        console.log(rs)
                                        // res.status(200).json({
                                        //message: "pieceId Updated"
                                        // })

                                    })
                                    .catch(err => {
                                        console.log(err);

                                    })

                            }
                            for (stepId in element.steps) {
                                Step.update({ _id: element.steps[stepId] }, { workflow: workflow._id })
                                    .exec()
                                    .then(rs => {
                                        console.log(rs);
                                        //  res.status(200).json({
                                        //message: "stepId Updated"
                                        // })

                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                            res.status(200).json({
                                message: 'workflowId is ' + workflow._id
                            })

                        }
                        )
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: err });

                        })

                });

            }
        })
}
exports.workflow_get_workflow = (req, res, next) => {
    const id = req.body.workflowId;
    if (!id)
    {
    Workflow.find()
        .select('_id municipality title description conditions pieces steps depot creationDate updateDate')
        .populate('conditions pieces steps')
        .exec()
        .then(docs => {
            res.status(200).json({
                count:docs.length,
                workflows:docs,
                response:true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                response:true
            })
        })
    }
    else
    {
        Workflow.find({_id:id})
        .select('_id municipality title description conditions pieces steps depot creationDate updateDate')
        .populate('conditions pieces steps')
        .exec()
        .then(docs => {
            res.status(200).json({
                count:docs.length,
                workflows:docs,
                response:true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                response:true
            })
        }) 
    }
}

exports.workflow_getall_workflow_by_municipalityId = (req, res, next) => {
    var id = req.body._id;
    Workflow.find({municipality:id})
        .select('_id category title description conditions pieces steps depot creationDate updateDate')
        .exec()
        .then(docs => {
            res.status(200).json({
                response:true,
                municipality:id,
                count:docs.length,
                workflows:docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                
                response:false
            })
        })
}
//workflow cannot be updated ( if we want to update a workflow we need to create a new one)
/*
exports.workflow_count_all = (req, res, next) => {
    Workflow.countDocuments()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: "Count all workflows",
                count: doc,
                response: true
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                response: false
            })
        })
}
*/
/*
exports.workflow_count_by_municipality = (req, res, next) => {
    var id = req.body._id;
    if (id) {
        Workflow.find({ municipality: id }).countDocuments()
            .exec()
            .then(doc => {
                console.log(doc);
                res.status(200).json({
                    message: "Count all workflows with municipality id: "+id,
                    count: doc,
                    response: true
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Municipality not found",
                    response: false
                })
            })
    } else {
        res.status(501).json({
            message: "Insert municipality _id",
            response: false
        })
    }
}
*/

exports.workflow_count_by_creationDate = (req, res, next) => {
    var date = req.body.creationDate;
    var day = new Date(date);
    console.log(day);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    console.log(nextDay);
    if (req.body.creationDate) {
        Workflow.find({ "creationDate": { "$gte": day, "$lt": nextDay } })//.countDocuments()
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "Count all workflows created on " + date,
                    count: doc.length,
                    workflows: doc,
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


exports.workflow_count_inRangeDate = (req, res, next) => {
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
        Workflow.find({ "creationDate": { "$gte": startDate, "$lt": endDate } })//.countDocuments()
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "Count all workflows created between " + start + " and " + end,
                    count: doc.length,
                    workflows: doc,
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


exports.workflow_count_by_creationDate_by_municipality = (req, res, next) => {
    var date = req.body.creationDate;
    var day = new Date(date);
    console.log(day);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    console.log(nextDay);
    var municipality = req.body._id;
    if (req.body.creationDate && req.body._id) {
        Workflow.find({ "municipality":municipality,"creationDate": { "$gte": day, "$lt": nextDay } })//.countDocuments()
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "Count all workflows created on " + date,
                    municipality: municipality,
                    count: doc.length,
                    workflows: doc,
                    response: true
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Wrong date and/or municipality _id",
                    response: false
                })
            })
    } else {
        res.status(501).json({
            message: "Insert date and/or municipality _id",
            response: false
        })
    }
}

exports.workflow_count_inRangeDate_ByMunicipality = (req, res, next) => {
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
    var municipality = req.body._id;
    if (req.body.start && req.body.end && req.body._id) {
        Workflow.find({ "municipality":municipality,"creationDate": { "$gte": startDate, "$lt": endDate } })//.countDocuments()
            .exec()
            .then(doc => {
                res.status(200).json({
                    message: "Count all workflows created between " + start + " and " + end,
                    municipality:municipality,
                    count: doc.length,
                    workflows: doc,
                    response: true
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Wrong date and/or municipality _id",
                    response: false
                })
            })
    } else {
        res.status(501).json({
            message: "Insert date start and/or date end and/or municipality _id",
            response: false
        })
    }
}
