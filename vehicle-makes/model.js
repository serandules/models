var log = require('logger')('model-vehicle-makes');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');
var model = require('model');

var types = validators.types;

var schema = Schema({
    title: {
        type: String,
        required: true,
        validator: types.title({
            length: 100
        })
    }
}, {collection: 'vehicle-makes'});

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
  {updatedAt: -1, _id: -1}
]);

module.exports = mongoose.model('vehicle-makes', schema);
