var log = require('logger')('models:clients:service');
var bodyParser = require('body-parser');
var serandi = require('serandi');
var model = require('model');
var mongutils = require('mongutils');
var errors = require('errors');

var grants = require('../grants');
var validators = require('./validators');

var Grants = grants.model;

module.exports = function (done) {
  var service = {
    auth: {},
    find: true,
    findOne: true,
    replaceOne: true,
    removeOne: true
  };

  service.createOne = function (req, res, next) {
    serandi.serve(req, res, next,
      bodyParser.json(),
      serandi.json,
      serandi.create(Grants),
      validators.create,
      function (req, res, next) {
        model.create(req.ctx, function (err, o) {
          if (err) {
            if (err.code === mongutils.errors.DuplicateKey) {
              return next(errors.conflict());
            }
            return next(err);
          }
          res.locate(o.id).status(201).send(o);
        });
      });
  };

  done(null, service);
};
