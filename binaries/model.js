var log = require('logger')('model-binaries');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');
var model = require('model');

var types = validators.types;

var schema = Schema({
  type: {
    type: String,
    required: true,
    validator: types.binaryType()
  },
  content: {
    type: String,
    required: true,
    validator: types.binary()
  }
}, {collection: 'binaries'});

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

model.ensureIndexes(schema, [
  {updatedAt: 1, _id: 1}
]);

module.exports = mongoose.model('binaries', schema);
