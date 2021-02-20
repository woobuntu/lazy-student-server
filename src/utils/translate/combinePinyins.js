const _ = require('fxjs/Strict');

const combinePinyins = _.pipe(
  _.map(
    _.pipe(
      _.map(({ word, pinyin }) => pinyin),
      _.join(' '),
    ),
  ),
);

module.exports = combinePinyins;
