var log = require('logger')('service-locations');
var bodyParser = require('body-parser');

var serandi = require('serandi');
var model = require('model');
var otps = require('../otps');

var Otps = otps.model;

var validators = require('./validators');

module.exports = function (done) {
  var service = {
    auth: {},
    workflow: 'model',
    findOne: true
  };

  service.createOne = function (req, res, next) {
    serandi.serve(req, res, next,
      bodyParser.json(),
      serandi.json,
      serandi.create(Otps),
      validators.create,
      function (req, res, next) {
        Otps.remove({
          user: req.user.id,
          name: req.body.name
        }, function (err) {
          if (err) {
            return next(err);
          }
          model.create(req.ctx, function (err, otp) {
            if (err) {
              return next(err);
            }
            res.locate(otp.id).status(201).send(otp);
          });
        });
      });
  };

  done(null, service);
};

