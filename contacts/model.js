var log = require('logger')('model-contacts');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');
var model = require('model');

var types = validators.types;
var requires = validators.requires;

var schema = Schema({
    name: {
        type: String,
        required: true,
        validator: types.string({
            length: 200
        })
    },
    email: {
        type: String,
        verify: ['reviewing', 'unpublished', 'published'],
        require: requires.contacts(),
        validator: types.email()
    },
    phone: {
        type: String,
        verify: ['reviewing', 'unpublished', 'published'],
        require: requires.contacts(),
        validator: types.phone()
    },
    messenger: {
        type: String,
        require: requires.contacts(),
        validator: types.string({
            length: 100
        })
    },
    skype: {
        type: String,
        require: requires.contacts(),
        validator: types.string({
            length: 100
        })
    }
}, {collection: 'contacts'});

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

module.exports = mongoose.model('contacts', schema);
