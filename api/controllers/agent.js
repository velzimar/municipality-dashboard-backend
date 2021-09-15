const mongoose = require('mongoose');
const Agent = require('../models/agent');
const Municipality = require('../models/municipality');
const jwt = require("jsonwebtoken");
const md5 = require('md5');
const { municipality_count_inRangeDate } = require('./municipality');

var moment = require("moment-timezone");

function pad_with_zeroes(number, length) {

  var my_string = '' + number;
  while (my_string.length < length) {
    my_string = '0' + my_string;
  }

  return my_string;

}
exports.agents_signup_agent = (req, res, next) => {
  var creationDate = moment()
  .utcOffset("+01:00")
  .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
  if (req.body.email) {
    Agent.find({ email: req.body.email })
      .exec()
      .then(agent => {
        if (agent.length >= 1) {
          res.status(409).json({
            message: "Email exists"
          });
        }
        else {
          Agent.countDocuments().then(count => {
            Municipality.findOne({ _id: req.body.municipality })
              .exec()
              .then(doc => {
                if (doc) {
                  var generatedLogin = pad_with_zeroes(doc.municipalityNumber, 3) + "-" + pad_with_zeroes(count, 3);
                  const agent = new Agent({
                    _id: new mongoose.Types.ObjectId(),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    login: generatedLogin,
                    password: md5(generatedLogin),
                    municipality: req.body.municipality,
                    agentNumber: count,
                    creationDate: creationDate
                  });
                  agent
                    .save()
                    .then(result => {
                      res.status(201).json({
                        message: "Agent created",
                        createdAgent: agent,
                        creationDate: creationDate
                      });
                    })
                    .catch(err => {
                      res.status(500).json({
                        error: err
                      });
                    });
                }
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                })
              });
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
  else {
    Agent.countDocuments().then(count => {
      Municipality.findOne({ _id: req.body.municipality })
        .exec()
        .then(doc => {
          if (doc) {
            var generatedLogin = pad_with_zeroes(doc.municipalityNumber, 3) + "-" + pad_with_zeroes(count, 3);
            const agent = new Agent({
              _id: new mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              login: generatedLogin,
              password: md5(generatedLogin),
              municipality: req.body.municipality,
              agentNumber: count,
              creationDate: creationDate
            });
            agent
              .save()
              .then(result => {
                res.status(201).json({
                  message: "Agent created",
                  createdAgent: agent,
                  creationDate: creationDate
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        });

    });


  }
};

exports.agents_login_agent = (req, res, next) => {
  var lastLoginDate = moment()
  .utcOffset("+01:00")
  .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
  Agent.findOneAndUpdate({ login: req.body.login }, { lastLoginDate: lastLoginDate }, { useFindAndModify: false })
    .exec()
    .then(agent => {
      if (agent.length < 1) {
        return res.status(401).json({
          error: 'User not found'
        });
      }
      if (req.body.password !== agent.password) {
        return res.status(401).json({
          error: 'Password incorrect'
        });
      }
      else {
        if (agent.enabled === false) {
          return res.status(401).json({
            error: 'Account disabled'
          });
        }
        else {
          const token = jwt.sign(
            {
              email: agent.email,
              userId: agent._id,
              municipalityId: agent.municipality,
              login: agent.login,
              firstName: agent.firstName,
              lastName: agent.lastName,
              agentNumber: agent.agentNumber,
              lastLoginDate: lastLoginDate
            },
            "agentsecret",
            {
              expiresIn: "72h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.agent_get_agent = (req, res, next) => {
  const id = req.body.agentId;
  if (!id) {
    Agent.find()
      .select('_id agentNumber login firstName lastName password municipality creationDate lastLoginDate enabled')
      .populate('municipality')
      .exec()
      .then(docs => {
        res.status(200).json({
          response:true,
          count:docs.length,
          agents:docs
        });
      })
      .catch(err => {
        res.status(500).json({
          response:false,
          error: err
        });
      });
  }
  else {
    Agent.find({ _id: id })
      .select('_id agentNumber login firstName lastName password municipality creationDate lastLoginDate enabled')
      .populate('municipality')
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json(doc);
        }
        else {
          res.status(404).json({
            message: "No valid entry found for the given ID"
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      });
  }
};

exports.agents_get_agent_bymunicipality = (req, res, next) => {
  const id = req.body.municipalityId;
  if(id){
  Agent.find({ municipality: id })
    .select('_id email login password agentNumber firstName lastName municipality enabled')
    .populate('municipality')
    .exec()
    .then(docs => {
      res.status(200).json({
        response:true,
        count:docs.length,
        agents:docs
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        response:false,
        message:"municipality _id not found"
      })
    });
  }else{
    res.status(500).json({
      response:false,
      message:"Insert municipality _id"
    })
  }
};

exports.agents_delete_agent = (req, res, next) => {

  Agent.updateOne({ _id: req.body.agentId }, { $set: { enabled: req.body.accountState } })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Agent account updated sucessfully"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
};

exports.agents_update_agent = (req, res, next) => {
  //TO DO: agents update routes
  var _id = req.body.agentId
  var props = req.body
  Agent.findByIdAndUpdate({ _id: _id }, props, {useFindAndModify:false})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Agent account updated sucessfully"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: "insert ID"
      })
    });
};


/*
exports.agents_count_all = (req, res, next) => {
  Agent.countDocuments()
      .exec()
      .then(doc => {
          console.log(doc);
          res.status(200).json({
              message: "Count all agents",
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
exports.agents_count_by_municipality = (req, res, next) => {
  var id = req.body._id;
  if (id) {
      Agent.find({ municipality: id }).countDocuments()
          .exec()
          .then(doc => {
              console.log(doc);
              res.status(200).json({
                  message: "Count all agents with municipality id: "+id,
                  count: doc,
                  response: true
              })
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  message: "municipality not found",
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


exports.agent_count_by_lastLoginDate = (req, res, next) => {
  var date = req.body.lastLoginDate;
  //date+="T00:00:00.000Z";
  var day = new Date(date);
  console.log(day);
  console.log(date);
  var nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  console.log(nextDay);
  if (req.body.lastLoginDate) {
      Agent.find({ "lastLoginDate": { "$gte": day, "$lt": nextDay } })//.countDocuments()
          .exec()
          .then(doc => {
              res.status(200).json({
                  message: "Count all agents logged on " + date,
                  count: doc.length,
                  agents: doc,
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


exports.agent_count_by_lastLoginDate_By_municipality = (req, res, next) => {
  var date = req.body.lastLoginDate;
  var municipality = req.body._id;
  var day = new Date(date);
  console.log(date);
  console.log(day);
  var nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  console.log(nextDay);
  if (req.body.lastLoginDate) {
      Agent.find({ "municipality":municipality,"lastLoginDate": { "$gte": day, "$lt": nextDay } })//.countDocuments()
          .exec()
          .then(doc => {
              res.status(200).json({
                  message: "Count all agents logged on " + date,
                  municipality:municipality,
                  count: doc.length,
                  agents: doc,
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


exports.agent_count_by_RangedlastLoginDate = (req, res, next) => {
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
  if (req.body.lastLoginDate) {
      Agent.find({ "lastLoginDate": { "$gte": startDate, "$lt": endDate } })//.countDocuments()
          .exec()
          .then(doc => {
              res.status(200).json({
                  message: "Count all agents logged on between" + startDate + " and " + endDate,
                  count: doc.length,
                  agents: doc,
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


exports.agent_count_by_RangedlastLoginDate_By_municipality = (req, res, next) => {
  var start = req.body.start;
  var end = req.body.end;
  var municipality = req.body._id;
  var startDate = new Date(start);
  var endDatee = new Date(end);
  console.log(start);
  console.log(end);
  console.log(startDate);
  //console.log(endDate);
  var endDate = new Date(endDatee);
  endDate.setDate(endDatee.getDate() + 1);
  console.log(endDate);
  if (req.body.lastLoginDate) {
      Agent.find({"municipality":municipality, "lastLoginDate": { "$gte": startDate, "$lt": endDate } })//.countDocuments()
          .exec()
          .then(doc => {
              res.status(200).json({
                  message: "Count all agents logged on between" + startDate + " and " + endDate,
                  municipality:municipality,
                  count: doc.length,
                  agents: doc,
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

