var log = require('logger')('models:tokens:service');
var bodyParser = require('body-parser');

var errors = require('errors');
var serandi = require('serandi');
var clients = require('../clients');
var tokens = require('../tokens');
var model = require('model');

var Clients = clients.model;
var Tokens = tokens.model;

var validators = require('./validators');

var MIN_ACCESSIBILITY = validators.MIN_ACCESSIBILITY;

var sendToken = function (req, res, next) {
  var clientId = req.body.client;
  Clients.findOne({
    _id: clientId
  }, function (err, client) {
    if (err) {
      log.error('clients:find-one', err);
      return next(errors.serverError());
    }
    if (!client) {
      return next(errors.unauthorized());
    }
    var location = req.body.location;
    var to = client.to;
    if (to.indexOf(location) === -1) {
      return next(errors.forbidden());
    }
    Tokens.findOne({
      user: req.user.id,
      client: client.id
    }, function (err, token) {
      if (err) {
        log.error('tokens:find-one', err);
        return next(errors.serverError());
      }
      var expires;
      if (token) {
        expires = token.accessibility();
        if (expires > MIN_ACCESSIBILITY) {
          res.send({
            id: token.id,
            access_token: token.access,
            refresh_token: token.refresh,
            expires_in: expires
          });
          return;
        }
      }
      model.create(req.ctx, function (err, token) {
        if (err) {
          log.error('tokens:create', err);
          return next(errors.serverError());
        }
        res.send({
          id: token.id,
          access_token: token.access,
          refresh_token: token.refresh,
          expires_in: token.accessible
        });
      });
    });
  });
};

module.exports = function (done) {
  var service = {
    auth: {
      GET: [
        '^\/$',
        '^\/.*'
      ],
      POST: [
        '^\/$',
        '^\/.*'
      ]
    },
    removeOne: true
  };

  service.findOne = function (req, res, next) {
    serandi.serve(req, res, next,
      serandi.id,
      serandi.findOne(Tokens),
      function (req, res, next) {
        model.findOne(req.ctx, function (err, token) {
          if (err) {
            return next(err);
          }
          res.send({
            id: token.id,
            user: req.user.id,
            client: token.client.id,
            access: token.access,
            refresh: token.refresh,
            createdAt: token.createdAt,
            accessible: token.accessible,
            refreshable: token.refreshable
          });
        });
      });
  };

  service.createOne = function (req, res, next) {
    serandi.serve(req, res, next,
      bodyParser.urlencoded({extended: true}),
      serandi.urlencoded,
      validators.grant,
      serandi.create(Tokens),
      function (req, res, next) {
        sendToken(req, res, next);
      });
  };

  done(null, service);
};