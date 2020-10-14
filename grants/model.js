var log = require('logger')('model-grants');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');
var model = require('model');

var types = validators.types;

var schema = Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients',
        validator: types.ref(),
        searchable: true,
        required: true
    }
}, {collection: 'grants'});

schema.plugin(mongins());
schema.plugin(mongins.user());
schema.plugin(mongins._());
schema.plugin(mongins.permissions());
schema.plugin(mongins.visibility());
schema.plugin(mongins.createdAt());
schema.plugin(mongins.updatedAt());
schema.plugin(mongins.modifiedAt());

model.ensureIndexes(schema, [
    {user: 1, client: 1}
], {unique: true});

module.exports = mongoose.model('grants', schema);
