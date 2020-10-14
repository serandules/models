var log = require('logger')('model-workflows');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');
var model = require('model');

var types = validators.types;

var schema = Schema({
  name: {
    type: String,
    required: true,
    searchable: true,
    validator: types.name({
      length: 100
    })
  },
  start: {
    type: String,
    required: true,
    searchable: true,
    validator: types.name({
      length: 100
    })
  },
  transitions: {
    type: Object,
    required: true
  },
  permits: {
    type: Object,
    required: true
  }
}, {collection: 'workflows'});

schema.plugin(mongins({
  /*transform: function (o) {
    o.transitions = JSON.parse(o.transitions);
  }*/
}));
schema.plugin(mongins.user());
schema.plugin(mongins._());
schema.plugin(mongins.permissions());
schema.plugin(mongins.visibility());
schema.plugin(mongins.createdAt());
schema.plugin(mongins.updatedAt());
schema.plugin(mongins.modifiedAt());

model.ensureIndexes(schema, [
  {name: 1, updatedAt: 1, _id: 1}
]);

module.exports = mongoose.model('workflows', schema);
