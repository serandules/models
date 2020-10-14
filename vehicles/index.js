
exports.model = require('./model');

exports.service = function (done) {
  done(null, {
    auth: {},
    find: true,
    findOne: true,
    createOne: true,
    updateOne: true,
    replaceOne: true,
    removeOne: true
  });
};