const mongoose = require('mongoose');

const Admin = require('../models/admin');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

var moment = require("moment-timezone");

exports.admin_signup_admin = (req, res, next) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then(admin => {
      if (admin.length >= 1) {
        res.status(409).json({
          message: "Email exists"
        });
      }
      else {
        bcryptjs.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            if (req.body.superadmin == false) {
              const admin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                municipality: req.body.municipality,
                numberOfAgents: req.body.numberOfAgents,
                superadmin: req.body.superadmin,
                creationDate: moment()
                .utcOffset("+01:00")
                .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
              });
              admin
                .save()
                .then(result => {
                  console.log(result);

                  res.status(201).json({
                    message: "admin created",
                    account: admin
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
            else {
              if (Admin.find({superadmin: true}))
              {return res.status(401).json({message: 'Superadmin already exists'})}  //there is only one superadmin for every municipality 
              const admin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                municipality:  req.body.municipality,
                numberOfAgents: 0, // this field is required so it must not be null 
                superadmin: req.body.superadmin,
                creationDate: moment()
                .utcOffset("+01:00")
                .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
              });
              admin
                .save()
                .then(result => {
                  console.log(result);


                  res.status(201).json({
                    message: "superadmin created",
                    account: admin
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }




          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.admin_login_admin = (req, res, next) => {
  var lastLoginDate = moment()
  .utcOffset("+01:00")
  .format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  
  var props = req.body;
  console.log(props)
  Admin.findOneAndUpdate({ email: props.email }, { lastLoginDate: lastLoginDate }, { useFindAndModify: false })
    .exec()
    .then(admin => {
      if (!admin) {
        return res.status(401).json({
          message: " Email address dosen't exist "
        });
      }
      bcryptjs.compare(props.password, admin.password, (err, result) => {
        if (err) {
          if (admin.superadmin === true) {

            console.log(err);
            return res.status(402).json({
              message: "superadmin Auth failed"
            });
          }
          else {
            console.log(err);
            return res.status(403).json({
              message: "admin Auth failed"
            });
          }
        }
        if (result) {

          console.log("result");
          if (admin.superadmin === true) {
            const token = jwt.sign(
              {
                email: admin.email,
                userId: admin._id,
                superadmin: admin.superadmin,
                numberOfAgents: admin.numberOfAgents,
                lastLoginDate: lastLoginDate
              },
              'superadminsecret',
              {
                expiresIn: "3h"
              }
            );

            return res.status(201).json({
              message: "Superadmin Auth successful",
              token: token
            });
          }
          else {
            const token = jwt.sign(
              {
                email: admin.email,
                userId: admin._id,
                municipalityId: admin.municipality,
                superadmin: admin.superadmin,
                municipality: admin.municipality,
                numberOfAgents: admin.numberOfAgents,
                lastLoginDate: lastLoginDate
              },
              'adminsecret',
              {
                expiresIn: "3h"
              }
            );

            return res.status(202).json({
              message: "admin Auth successful",
              token: token
            });
          }
        }
        res.status(405).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
};
exports.admin_get_admin = (req, res, next) => {
  const id = req.body.adminId;
  if (!id) {
    Admin.find()
      .select('_id email password municipality creationDate lastLoginDate')
      .populate('municipality')
      .exec()
      .then(docs => {
        res.status(200).json({
          response:true,
          count: docs.length,
          result: docs
        });
      })
      .catch(err => {
        res.status(500).json({
          response:false
        });
      });
  }
  else {
    Admin.find({ _id: id })
      .select('_id email password municipality numberOfAgents creationDate lastLoginDate')
      .populate('municipality')
      .exec()
      .then(doc => {
          res.status(200).json(doc);
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      });
  }
};

//probleme update password
exports.admin_patch_admin = (req, res, next) => {
  const id = req.body.adminId;
  const props = req.body;
  Admin.update({ _id: id }, props)
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "admin updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    })

}
exports.admin_delete_admin = (req, res, next) => {
  const id = req.body.adminId;
  Admin.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Admin successfully deleted"
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}


exports.admin_get_and_count_superadmins = (req, res, next) => {

    Admin.find({"superadmin":true})
      .select('_id email password creationDate lastLoginDate')
      //.populate('municipality')
      .exec()
      .then(docs => {
        res.status(200).json({
          response:true,
          count: docs.length,
          superadmins: docs
        });
      })
      .catch(err => {
        res.status(500).json({
          response:false
        });
      });

};

exports.admin_get_and_count_supervisors = (req, res, next) => {

  Admin.find({"superadmin":false})
    .select('_id email password municipality creationDate lastLoginDate')
    .populate('municipality')
    .exec()
    .then(docs => {
      res.status(200).json({
        response:true,
        count: docs.length,
        supervisors: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        response:false
      });
    });

};
