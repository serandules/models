var log = require('logger')('model-tiers');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');

var types = validators.types;

var schema = Schema({
  name: {
    type: String,
    required: true,
    validator: types.string({
      length: 20
    })
  },
  description: {
    type: String,
    validator: types.string({
      length: 1000
    })
  },
  apis: {
    type: Object,
    required: true,
    server: true
  },
  ips: {
    type: Object,
    required: true,
    server: true
  }
}, {collection: 'tiers'});

schema.plugin(mongins());
schema.plugin(mongins.user());
schema.plugin(mongins._({
  workflow: 'model'
}));
schema.plugin(mongins.permissions({
  workflow: 'model'
}));
schema.plugin(mongins.status({
  workflow: 'model'
}));
schema.plugin(mongins.visibility({
  workflow: 'model'
}));
schema.plugin(mongins.createdAt());
schema.plugin(mongins.updatedAt());
schema.plugin(mongins.modifiedAt());

module.exports = mongoose.model('tiers', schema);
