const axios = require('axios');
const {
  kakaoApi: { api_url, app_key },
} = require('../../config');
const _ = require('fxjs/Strict');
const L = require('fxjs/Lazy');
const C = require('fxjs/Concurrency');
const qs = require('querystring');

const Kakao = _.pipe(
  L.map(sentence =>
    qs.stringify({
      query: sentence,
      src_lang: 'cn',
      target_lang: 'kr',
    }),
  ),
  L.map(requestBody => ({
    url: api_url,
    requestBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `KakaoAK ${app_key}`,
    },
  })),
  L.map(({ url, requestBody, headers }) =>
    axios.post(url, requestBody, { headers }),
  ),
  C.map(({ data: { translated_text } }) => translated_text[0][0]),
);

module.exports = Kakao;
