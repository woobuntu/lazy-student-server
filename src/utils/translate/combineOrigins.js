const { map, compoundFunctions } = require('../../functions');

const combineOrigins = compoundFunctions(map(map(({ word }) => word)));

module.exports = combineOrigins;
