const axios = require('axios');
const {
  kakaoApi: { api_url, app_key },
} = require('../../config');
const { Reserve, Concurrent, compoundFunctions } = require('../../functions');
const qs = require('querystring');

const Kakao = compoundFunctions(
  Reserve.map(sentence =>
    qs.stringify({
      query: sentence,
      src_lang: 'cn',
      target_lang: 'kr',
    }),
  ),
  Reserve.map(requestBody => ({
    url: api_url,
    requestBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `KakaoAK ${app_key}`,
    },
  })),
  Reserve.map(({ url, requestBody, headers }) =>
    axios.post(url, requestBody, { headers }),
  ),
  Concurrent.map(({ data: { translated_text } }) => translated_text[0][0]),
);

module.exports = Kakao;
