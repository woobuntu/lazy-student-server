const axios = require('axios');
const {
  papagoAPI: { client_id, client_secret },
} = require('../../config');
const { Reserve, Concurrent, compoundFunctions } = require('../../functions');

const Papago = compoundFunctions(
  Reserve.map(sentence => ({
    url: 'https://openapi.naver.com/v1/papago/n2mt',
    data: { source: 'zh-CN', target: 'ko', text: sentence },
    method: 'POST',
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret,
    },
  })),
  Reserve.map(options => axios(options)),
  Concurrent.map(
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
