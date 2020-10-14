var log = require('logger')('model-realestates');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mongins = require('mongins');
var validators = require('validators');
var model = require('model');

var locations = require('../locations');
var Locations = locations.model;

var types = validators.types;
var requires = validators.requires;

var schema = Schema({
    location: {
        type: Schema.Types.ObjectId,
        ref: 'locations',
        validator: types.ref(),
        required: true
    },
    contact: {
        type: Schema.Types.ObjectId,
        ref: 'contacts',
        validator: types.ref(),
        required: true
    },
    type: {
        type: String,
        validator: types.string({
            enum: [
                'annex',
                'apartment',
                'building',
                'house',
                'land',
                'room'
            ]
        }),
        required: true,
        searchable: true
    },
    title: {
        type: String,
        validator: types.string({
            length: 100
        })
    },
    residential: {
        type: Boolean,
        require: requires.realEstateUsage(),
        validator: types.boolean(),
        searchable: true
    },
    commercial: {
        type: Boolean,
        require: requires.realEstateUsage(),
        validator: types.boolean(),
        searchable: true
    },
    offer: {
        type: String,
        validator: types.string({
            enum: [
                'sell',
                'rent'
            ]
        }),
        required: true,
        searchable: true
    },
    extent: {
        type: Number,
        validator: types.number({
            min: 0
        }),
        require: requires.realEstateSize(),
        searchable: true,
        sortable: true
    },
    area: {
        type: Number,
        validator: types.number({
            min: 0
        }),
        require: requires.realEstateSize(),
        searchable: true,
        sortable: true
    },
    floors: {
        type: Number,
        validator: types.number({
            min: 0,
            integer: true
        }),
        require: requires.realEstateFloors(),
        searchable: true,
        sortable: true
    },
    bedrooms: {
        type: Number,
        validator: types.number({
            min: 0,
            integer: true
        }),
        searchable: true,
        sortable: true
    },
    bathrooms: {
        type: Number,
        validator: types.number({
            min: 0,
            integer: true
        }),
        searchable: true,
        sortable: true
    },
    parking: {
        type: Number,
        validator: types.number({
            min: 0,
            integer: true
        }),
        searchable: true,
        sortable: true
    },
    price: {
        type: Number,
        validator: types.number({
            min: 0
        }),
        required: true,
        searchable: true,
        sortable: true
    },
    currency: {
        type: String,
        validator: types.string({
            enum: ['LKR']
        }),
        required: true
    },
    description: {
        type: String,
        validator: types.string({
            length: 5000
        })
    },
    images: {
        type: [Schema.Types.ObjectId],
        ref: 'binaries',
        validator: types.array({
            max: 10,
            min: 1,
            validator: types.ref()
        })
    }
}, {collection: 'realestates'});

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
schema.plugin(mongins.tags({
    location: Locations.tagger
}));

model.ensureIndexes(schema, [
    {price: 1, updatedAt: 1, _id: 1},
    {price: 1, updatedAt: -1, _id: -1}
]);

module.exports = mongoose.model('realestates', schema);
