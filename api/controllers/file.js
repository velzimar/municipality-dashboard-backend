const mongoose = require("mongoose");
const File = require("../models/file");
const Filecondition = require("../models/filecondition");
const Filepiece = require("../models/filepiece");
const Agent = require("../models/agent");
const fileLog = require("../models/fileLog");
const conditions = require("../models/conditions");
var moment = require("moment-timezone");
 //current date !!
/*
exports.file_create_file = (req,res,next) =>
{
    File.find({nomcitoyen: req.body.nomcitoyen}&& {prenomcitoyen: req.body.prenomcitoyen} && {workflow: req.body.workflow})
    .exec()
    .then(result => {
        if (result.length > 0)
        {
            res.status(409).json({
                message: "file already exists"
            })
        }
        else
        {
            const file = new File({
                _id: new mongoose.Types.ObjectId,
                nomcitoyen: req.body.nomcitoyen,
                prenomcitoyen: req.body.prenomcitoyen,
                emailcitoyen: req.body.emailcitoyen,
                workflow: req.body.workflow,
                creationDate: new Date()
            })
            file.save()
        .then(rs => {
            res.status(200).json({
                message: "file created successfuly",
                citizenfile: file
            })
            .catch(err => 
                {   console.log(err)
                    res.status(500).json({error: err})
                })

        })
           
        }
        
    })
    .catch(err => 
        {   console.log(err)
            res.status(500).json({error: err})  
        })
}
*/

/*
exports.file_create_fileLog = (req,res,next) =>
{
    const props = req.body;
    console.log(props);
    const log = new fileLog({
        _id: new mongoose.Types.ObjectId,
        file: req.body.file,
        agent: req.body.agent,
        oldFields:props,
        updatedFields:props,
        updateDate: new Date(),
    })
    log.save()
    .then(result => {
        res.status(201).json({
            message: "Created filelog successfully",

            createdMunicipality: result
        });
        })
        .catch(err => {
        res.status(500).json({
              error: err
            });
        });

}
*/

exports.file_create_file = (req, res, next) => {
  const  currentDate = moment()
    .utcOffset("+01:00")
    .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
    
  File.find({
    nomcitoyen: req.body.nomcitoyen,
    prenomcitoyen: req.body.prenomcitoyen,
    workflow: req.body.workflow,
    creationDate: currentDate,
  })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(409).json({
          message: "file already exists",
        });
      } else {
        const file = new File({
          _id: new mongoose.Types.ObjectId(),
          nomcitoyen: req.body.nomcitoyen,
          prenomcitoyen: req.body.prenomcitoyen,
          emailcitoyen: req.body.emailcitoyen,
          workflow: req.body.workflow,
          agent: req.body.agent,
          creationDate: currentDate,//new Date(req.body.date),
          lastUpdateDate: currentDate,//new Date(req.body.date),
          currentStatus: req.body.currentStatus,
        });
        console.log(file);
        file
          .save()
          .then((rs) => {
            res.status(200).json({
              message: "file created successfuly",
              citizenfile: file,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(501).json({ error: err });
    });
};

exports.file_get_file = (req, res, next) => {
  const id = req.body.fileId;
  if (!id) {
    File.find()
      .exec()
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  } else {
    File.find({ _id: id })
      .exec()
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
};

exports.file_update_file = (req, res, next) => {

  const currentDate = moment()
  .utcOffset("+01:00")
  .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

  console.log(currentDate);
  if (req.body.fileId && req.body.agentId && !req.body.workflow) {
    const id = req.body.fileId;
    const props = req.body;
    props.lastUpdateDate = currentDate;
    var agent = props.agentId;
    console.log(agent);
    delete props.agentId;

    console.log(props);
    File.findOneAndUpdate({ _id: id }, props, { useFindAndModify: false })
      .select("-__v -_id -agent -workflow -creationDate")
      .populate("agent")
      .exec()
      .then((result) => {
        //console.log(result);//this shows the object BEFORE the update
        /*
        Agent.findById({ _id: agent })
          .exec()
          .then((r) => {
            //console.log(r);
            //console.log(r.enable);
            if (r.enabled == false) {
              res.status(501).json({
                message: "the agent is disabled",
              });
            } else {
              */
        delete props.fileId;
        const log = new fileLog({
          _id: new mongoose.Types.ObjectId(),
          file: id,
          agent: agent,
          oldFields: result,
          newFields: props,
          updateDate: props.lastUpdateDate,
        });
        log
          .save()
          .then((ress) => {
            res.status(201).json({
              message: "Created filelog successfully",
              log: ress,
              message: "file updated successfully",
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
        /*
            }
          })
          
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
              message: "fail to find agent",
            });
          });
          */
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
          message: "fail to update file",
        });
      });
  } else {
    res.status(550).json({
      message: "Insert agentId & fileId",
    });
  }
};

exports.file_count_by_creationDate = (req, res, next) => {
  console.log("today");
  var today;
  let nextDay;
  var date;
  let day;
  if (req.body.creationDate) {
    today = moment(req.body.creationDate)
      .utcOffset("+02:00")
      .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
    console.log(today);

    day = today;
    //test between
    if (req.body.end && req.body.end != req.body.creationDate) {
      console.log("end ");
      nextDay = moment(req.body.end)
        //.utcOffset("+00:00")
        .add(1, "days")
        .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      console.log(nextDay);
      date =
        "between " + day.substring(0, 10) + " and " + nextDay.substring(0, 10);
    } else {
      console.log("end doesnt");
      nextDay = moment(today)
        .utcOffset("-00:00")
        .add(1, "days")
        .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      console.log(nextDay);
      date = "on " + day.substring(0, 10);
    }
    console.log("first " + day.substring(0, 10));
    console.log("first " + date);
    console.log("last " + nextDay.substring(0, 10));
  }
  /*

  var date = (req.body.creationDate + "").substring(0, 10);
  var day = new Date(date);
  console.log(day);
  var nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  console.log(nextDay);*/
  if (req.body.agentId && req.body.creationDate) {
    var agentId = req.body.agentId;
    File.find({ agent: agentId, creationDate: { $gte: day, $lt: nextDay } }) //.countDocuments()
      .populate("agent")
      .sort({ creationDate: "desc" })
      .exec()
      .then((doc) => {
        res.status(200).json({
          message: "Count all files created " + date + " by agent " + agentId,
          agent: agentId,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else if (req.body.creationDate && !req.body.agentId) {
    File.find({ creationDate: { $gte: day, $lt: nextDay } }) //.countDocuments()
      .populate("agent")
      .sort({ creationDate: "desc" })
      .exec()
      .then((doc) => {
        res.status(200).json({
          message: "Count all files created " + date,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else if (!req.body.creationDate && !req.body.agentId) {
    File.find() //.countDocuments()
      .populate("agent")
      .sort({ creationDate: "desc" })
      .exec()
      .then((doc) => {
        res.status(200).json({
          message: "Count all files",
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "error find all",
          response: false,
        });
      });
  }else if (!req.body.creationDate && req.body.agentId){
    var agentId = req.body.agentId;
    File.find({ agent: agentId }) //.countDocuments()
      .populate("agent")
      .sort({ creationDate: "desc" })
      .exec()
      .then((doc) => {
        res.status(200).json({
          message: "Count all files created by agent " + agentId,
          agent: agentId,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Wrong agentId",
          response: false,
        });
      });
  } 
  
  
  else {
    res.status(501).json({
      message: "Problem",
      response: false,
    });
  }
};

exports.files_count_byCreationDate_between = (req, res, next) => {
  var start = (req.body.start + "").substring(0, 10);
  var end = (req.body.end + "").substring(0, 10);
  var startDate = new Date(start);
  var endDatee = new Date(end);
  console.log("start" + start);
  console.log("end" + end);
  console.log("startdate" + startDate);
  //console.log(endDate);
  var endDate = new Date(endDatee);
  endDate.setDate(endDatee.getDate() + 1);
  console.log("enddate" + endDate);
  if (req.body.agentId && req.body.start && req.body.end) {
    var agentId = req.body.agentId;
    File.find({
      agent: agentId,
      creationDate: { $gte: startDate, $lt: endDate },
    }) //.countDocuments()
      .populate("agent")
      .sort({ creationDate: "desc" })
      .exec()
      .then((doc) => {
        console.log(doc);
        res.status(200).json({
          message:
            "Count all files created between " +
            start +
            " and " +
            end +
            " by agent " +
            agentId,
          agent: agentId,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else {
    if (req.body.start && req.body.end) {
      File.find({ creationDate: { $gte: startDate, $lt: endDate } }) //.countDocuments()
        .populate("agent")
        .sort({ creationDate: "desc" })
        .exec()
        .then((doc) => {
          res.status(200).json({
            message: "Count all files created between " + start + " and " + end,
            count: doc.length,
            files: doc,
            response: true,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: "Wrong date",
            response: false,
          });
        });
    } else {
      res.status(501).json({
        message: "Insert date start and/or date end",
        response: false,
      });
    }
  }
};
exports.file_count_by_updateDate = (req, res, next) => {
  console.log("today");
  var today;
  let nextDay;
  var date;
  let day;
  if (req.body.updateDate) {
    today = moment(req.body.updateDate)
      .utcOffset("+02:00")
      .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
    console.log(today);

    day = today;
    //test between
    if (req.body.end && req.body.end != req.body.updateDate) {
      console.log("end ");
      nextDay = moment(req.body.end)
        //.utcOffset("+00:00")
        .add(1, "days")
        .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      console.log(nextDay);
      date =
        "between " + day.substring(0, 10) + " and " + nextDay.substring(0, 10);
    } else {
      console.log("end doesnt");
      nextDay = moment(today)
        .utcOffset("-00:00")
        .add(1, "days")
        .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      console.log(nextDay);
      date = "on " + day.substring(0, 10);
    }
    console.log("first " + day.substring(0, 10));
    console.log("first " + date);
    console.log("last " + nextDay.substring(0, 10));
  }
  /*
  let nextDay = moment(today).utcOffset("+00:00").add(1,"days").format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  console.log(nextDay);
  if (req.body.updateDate) var date = req.body.updateDate.substring(0, 10);
*/

  //const nexte = today.add("days", 1);
  //console.log(nexte);
  //if (req.body.updateDate) var date = req.body.updateDate.substring(0, 10);
  /*var day = new Date(date);
  console.log(day);

  var nextDay = //new Date(day);
  nextDay.setDate(day.getDate() + 1);

  console.log(nextDay);
*/
  if (req.body.fileId) {
    var id = req.body.fileId;
    if (req.body.updateDate && req.body.updated) {
      var updated = req.body.updated;
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({
            agent: agentId,
            updateDate: { $gte: day, $lt: nextDay },
            updated: updated,
            file: id,
          }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message:
                "File " + id + " updated " + date + " by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      } else {
        fileLog
          .find({
            updateDate: { $gte: day, $lt: nextDay },
            updated: updated,
            file: id,
          }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "File " + id + " updated " + date,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      }
    } else if (req.body.updateDate && !req.body.updated) {
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({
            agent: agentId,
            updateDate: { $gte: day, $lt: nextDay },
            file: id,
          }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message:
                "File " + id + " updated " + date + " by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      } else {
        fileLog
          .find({ updateDate: { $gte: day, $lt: nextDay }, file: id }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "File " + id + " updated " + date,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      }
    } else if (!req.body.updateDate && req.body.updated) {
      var updated = req.body.updated;
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({
            agent: agentId,
            updated: updated,
            file: id,
          }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "File " + id + " updated by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong fileId and/or agentId",
              response: false,
            });
          });
      } else {
        fileLog
          .find({ updated: updated, file: id }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "File " + id + " updated",
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong fileId",
              response: false,
            });
          });
      }
    } else {
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({
            agent: agentId,
            file: id,
          }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "File " + id + " updated by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong fileId and/or agentId",
              response: false,
            });
          });
      } else {
        fileLog
          .find({ file: id }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "File " + id + " updated",
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong fileId",
              response: false,
            });
          });
      }
    }
  } else {
    if (req.body.updateDate && req.body.updated) {
      var updated = req.body.updated;
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({
            agent: agentId,
            updateDate: { $gte: day, $lt: nextDay },
            updated: updated,
          }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated " + date + " by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      } else {
        fileLog
          .find({ updateDate: { $gte: day, $lt: nextDay }, updated: updated }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated " + date,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      }
    } else if (req.body.updateDate && !req.body.updated) {
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({ agent: agentId, updateDate: { $gte: day, $lt: nextDay } }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated " + date + " by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      } else {
        fileLog
          .find({ updateDate: { $gte: day, $lt: nextDay } }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated " + date,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong date",
              response: false,
            });
          });
      }
    } else if (!req.body.creationDate && req.body.updated) {
      var updated = req.body.updated;
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({ agent: agentId, updated: updated }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong agentId",
              response: false,
            });
          });
      } else {
        fileLog
          .find({ updated: updated }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated",
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "unknown",
              response: false,
            });
          });
      }
    } else {
      if (req.body.agentId) {
        var agentId = req.body.agentId;
        fileLog
          .find({ agent: agentId }) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated by agent " + agentId,
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Wrong agentId",
              response: false,
            });
          });
      } else {
        fileLog
          .find({}) //.countDocuments()
          .populate("agent")
          .sort({ updateDate: "desc" })
          .exec()
          .then((doc) => {
            res.status(200).json({
              message: "all files updated",
              count: doc.length,
              files: doc,
              response: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "unknown",
              response: false,
            });
          });
      }
    }
  }
};
/*
exports.files_count_byUpdateDate_between = (req, res, next) => {
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
  if (req.body.agentId && req.body.start && req.body.end && req.body.updated) {
    var updated = req.body.updated;
    var agentId = req.body.agentId;
    fileLog
      .find({
        agent: agentId,
        updateDate: { $gte: startDate, $lt: endDate },
        updated: updated,
      }) //.countDocuments()
      .exec()
      .then((doc) => {
        res.status(200).json({
          message:
            "Count all files updated between " +
            start +
            " and " +
            end +
            " by agent " +
            agentId,
          agent: agentId,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else if (
    req.body.start &&
    req.body.end &&
    req.body.updated &&
    !req.body.agentId
  ) {
    var updated = req.body.updated;
    fileLog
      .find({ updateDate: { $gte: startDate, $lt: endDate }, updated: updated }) //.countDocuments()
      .exec()
      .then((doc) => {
        res.status(201).json({
          message: "Count all files updated between " + start + " and " + end,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(501).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else if (
    req.body.agentId &&
    req.body.start &&
    req.body.end &&
    !req.body.updated
  ) {
    var agentId = req.body.agentId;
    fileLog
      .find({ agent: agentId, updateDate: { $gte: startDate, $lt: endDate } }) //.countDocuments()
      .exec()
      .then((doc) => {
        res.status(202).json({
          message:
            "Count all files updated between " +
            start +
            " and " +
            end +
            " by agent " +
            agentId,
          agent: agentId,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(502).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else if (req.body.end && req.body.start) {
    fileLog
      .find({ updateDate: { $gte: startDate, $lt: endDate } }) //.countDocuments()
      .exec()
      .then((doc) => {
        res.status(203).json({
          message: "Count all files updated between " + start + " and " + end,
          count: doc.length,
          files: doc,
          response: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(503).json({
          message: "Wrong date",
          response: false,
        });
      });
  } else {
    res.status(504).json({
      message: "Insert date start and/or date end",
      response: false,
    });
  }
};
*/
exports.file_create_file_details = (req, res, next) => {
  let conditionNb = 0;
  let pieceNb = 0;
  for (let element in req.body.conditionArray) {
    let file = new Filecondition({
      _id: new mongoose.Types.ObjectId(),
      conditionfournie: req.body.conditionArray[element].conditionId,
      commentaire: req.body.conditionArray[element].commentaire,
      isSatisfied: req.body.conditionArray[element].isSatisfayed,
      numfile: req.body.conditionArray[element].fileId,
    });
    file
      .save()
      .then()
      .catch((err) => {
        console.log(err);
      });
    conditionNb++;
  }
  for (let element in req.body.pieceArray) {
    let file = new Filepiece({
      _id: new mongoose.Types.ObjectId(),
      piecefournie: req.body.pieceArray[element].pieceId,
      commentaire: req.body.pieceArray[element].commentaire,
      isSatisfied: req.body.pieceArray[element].isSatisfayed,
      numfile: req.body.pieceArray[element].fileId,
    });
    file
      .save()
      .then()
      .catch((err) => {
        console.log(err);
      });
    pieceNb++;
  }

  if (
    conditionNb === req.body.conditionArray.length &&
    pieceNb === req.body.pieceArray.length
  ) {
    res.status(200).json({
      message: "file details created successfully",
    });
  } else {
    res.status(500).json({
      error: "file details creation error",
    });
  }
};

exports.get_filelog_by_fileId = (req, res) => {
  id = req.body.fileId;
  if (!id) {
    res.status(501).json({
      message: "Insert Id",
      response: false,
    });
  } else {
    fileLog
      .find({ file: id })
      .exec()
      .then((log) => {
        res.status(200).json({
          response: true,
          count: log.length,
          logs: log,
        });
      });
  }
};
