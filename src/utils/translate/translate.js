const getPinyin = require('./getPinyin');
const slice = require('./slice');
const Papago = require('./Papago');
const Kakao = require('./Kakao');
const combineOrigins = require('./combineOrigins');
const combinePinyins = require('./combinePinyins');

module.exports = async (req, res) => {
  const { origin, subject } = req.body;
  const sentences = slice(origin);

  try {
    const [
      { value: pinyin },
      { value: naverTranslation },
      { value: kakaoTranslation },
    ] = await Promise.allSettled([
      getPinyin(sentences),
      subject == 'kakao' ? [] : Papago(sentences),
      subject == 'naver' ? [] : Kakao(sentences),
    ]);
    const listOfOrigin = combineOrigins(pinyin);
    const listOfPinyin = combinePinyins(pinyin);

    const data = [];
    for (let index = 0; index < sentences.length; index++) {
      data.push({
        kakao: {
          text: kakaoTranslation.error
            ? 'api 요청 한도를 초과하였습니다 ㅠㅠ'
            : kakaoTranslation[index],
          modifying: false,
        },
        naver: {
          text: naverTranslation.error
            ? 'api 요청 한도를 초과하였습니다 ㅠㅠ'
            : naverTranslation[index],
          modifying: false,
        },
        pinyin: {
          text: pinyin.error
            ? '네이버 사전으로부터 병음을 가져오는데 실패하였습니다 ㅠㅠ'
            : listOfPinyin[index],
          modifying: false,
        },
        origin: listOfOrigin[index],
      });
    }
    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
