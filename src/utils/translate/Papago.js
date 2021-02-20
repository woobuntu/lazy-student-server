const axios = require('axios');
const {
  papagoAPI: { client_id, client_secret },
} = require('../../config');
const _ = require('fxjs/Strict');
const L = require('fxjs/Lazy');
const C = require('fxjs/Concurrency');

const Papago = _.pipe(
  L.map(sentence => ({
    url: 'https://openapi.naver.com/v1/papago/n2mt',
    data: { source: 'zh-CN', target: 'ko', text: sentence },
    method: 'POST',
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret,
    },
  })),
  L.map(options => axios(options)),
  C.map(
    ({
      data: {
        message: {
          result: { translatedText },
        },
      },
    }) => translatedText,
  ),
);

module.exports = Papago;
