const _ = require('fxjs/Strict');

const combineOrigins = _.pipe(_.map(_.map(({ word }) => word)));

module.exports = combineOrigins;
