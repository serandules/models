var log = require('logger')('model-configs');
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
    unique: true,
    searchable: true,
    validator: types.name({
      length: 100
    })
  },
  value: {
    type: String,
    required: true,
    validator: types.json({
      length: 10000
    })
  }
}, {collection: 'configs'});

schema.plugin(mongins({
  transform: function (o) {
    try {
      o.value = JSON.parse(o.value);
    } catch (e) {
      o.value = null;
    }
  }
}));
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
  {name: 1, updatedAt: 1, _id: 1}
]);

module.exports = mongoose.model('configs', schema);
