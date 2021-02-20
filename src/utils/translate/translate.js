const axios = require('axios');
const qs = require('querystring');
const config = require('../../config');
const getPinyin = require('./getPinyin');
const textcontrol = require('./textcontrol');
const arrange = require('./arrange');
const Papago = require('./Papago');

module.exports = async (req, res) => {
  const text = req.body.origin.replace(/(\s*)/g, '');
  const subject = req.body.subject;
  const slicedSentences = textcontrol(text);
  const pinyin = await getPinyin(slicedSentences);
  if (pinyin.error) {
    res.status(500).json({
      error: '네이버로부터 병음을 가져오는데 문제가 생겼습니다.',
    });
  }
  const { listOfOrigin, listOfPinyin } = await arrange(pinyin);

  let naverTranslation = [];
  //파파고 api
  if (subject === 'naver' || subject === 'both') {
    naverTranslation = await Papago(slicedSentences);
    if (naverTranslation.error) {
      res.status(500).json({
        error: '네이버로부터 번역을 가져오는데 문제가 생겼습니다.',
      });
    }
  }

  let kakaoTranslation = [];
  // 카카오 api
  if (subject === 'kakao' || subject === 'both') {
    try {
      for (const element of slicedSentences) {
        let jsonResult;
        if (!element) {
          jsonResult = [];
        } else {
          const requestBody = qs.stringify({
            query: element,
            src_lang: 'cn',
            target_lang: 'kr',
          });
          const apiResult = await axios.post(
            config.kakaoApi.api_url,
            requestBody,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `KakaoAK ${config.kakaoApi.app_key}`,
              },
            },
          );
          jsonResult = apiResult.data.translated_text[0][0];
        }
        kakaoTranslation.push(jsonResult);
      }
    } catch (apiError) {
      console.log(apiError);
    }
    if (kakaoTranslation.length === 0) {
      for (let index = 0; index < slicedSentences.length; index++) {
        kakaoTranslation.push('카카오 api 요청 건수가 초과되었습니다 ㅠㅠ');
      }
    }
  }

  //구글 api
  const data = [];
  for (let index = 0; index < slicedSentences.length; index++) {
    data.push({
      kakao: { text: kakaoTranslation[index], modifying: false },
      naver: { text: naverTranslation[index], modifying: false },
      pinyin: { text: listOfPinyin[index], modifying: false },
      origin: listOfOrigin[index],
    });
  }
  await res.status(200).json({
    data,
  });
};
