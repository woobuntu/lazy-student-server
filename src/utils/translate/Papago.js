const axios = require('axios');
const config = require('../../config');

const Papago = async text => {
  const array = [];
  try {
    for (const el of text) {
      let jsonResult;
      if (!el) {
        jsonResult = [];
      } else {
        const options = {
          url: 'https://openapi.naver.com/v1/papago/n2mt',
          data: { source: 'zh-CN', target: 'ko', text: el },
          method: 'POST',
          headers: {
            'X-Naver-Client-Id': config.papagoAPI.client_id,
            'X-Naver-Client-Secret': config.papagoAPI.client_secret,
          },
        };
        const {
          data: {
            message: {
              result: { translatedText },
            },
          },
        } = await axios(options);
        jsonResult = translatedText;
      }
      array.push(jsonResult);
    }
  } catch (curlError) {
    console.log(curlError);
    return {
      error: curlError,
    };
  }
  return array;
};

module.exports = Papago;
