var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongins = require('mongins');
var utils = require('utils');
var validators = require('validators');
var model = require('model');

var types = validators.types;
var values = validators.values;

var schema = Schema({
  password: {
    type: String,
    required: true,
    encrypted: true,
    validator: types.password({
      block: function (o, done) {
        var email = o.data.email || (o.user && o.user.email);
        var username = o.data.username || (o.user && o.user.username);
        var blocked = {};
        if (email) {
          blocked.email = email;
        }
        if (username) {
          blocked.username = username;
        }
        done(null, blocked);
      }
    })
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator: types.email(),
    searchable: true
  },
  avatar: {
    type: Schema.Types.ObjectId,
    ref: 'binaries',
    validator: types.ref()
  },
  groups: {
    type: [Schema.Types.ObjectId],
    ref: 'groups',
    validator: types.groups(),
    value: values.groups()
  },
  username: {
    type: String,
    unique: true,
    required: true,
    validator: types.username({
      length: 50
    }),
    searchable: true
  },
  name: {
    type: String,
    validator: types.name({
      length: 200
    })
  },
  birthday: {
    type: Date,
    validator: types.birthday()
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'locations',
    validator: types.ref()
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'contacts',
    validator: types.ref()
  }
}, {collection: 'users'});

schema.plugin(mongins());
schema.plugin(mongins._({
  workflow: 'model-users'
}));
schema.plugin(mongins.status({
  workflow: 'model-users'
}));
schema.plugin(mongins.permissions({
  workflow: 'model-users'
}));
schema.plugin(mongins.visibility({
  workflow: 'model-users'
}));
schema.plugin(mongins.createdAt());
schema.plugin(mongins.updatedAt());
schema.plugin(mongins.modifiedAt());

model.ensureIndexes(schema, [
  {updatedAt: -1, _id: -1}
]);

schema.statics.auth = function (user, password, done) {
  utils.compare(password, user.password, done);
};

module.exports = mongoose.model('users', schema);
