const { compoundFunctions, map, join } = require('../../functions');

const combinePinyins = compoundFunctions(
  map(
    compoundFunctions(
      map(({ word, pinyin }) => pinyin),
      join(' '),
    ),
  ),
);

module.exports = combinePinyins;
