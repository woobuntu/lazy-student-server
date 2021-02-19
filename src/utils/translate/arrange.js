module.exports = async array => {
  let result = {};
  const completedPinyinArray = [];
  const completedOriginArray = [];
  array.forEach(element => {
    let pinyinArray = [];
    let originArray = [];
    element.forEach(e => {
      if (e.pinyin === "") {
        pinyinArray.push(e.word);
        originArray.push(e.word);
      } else {
        pinyinArray.push(e.pinyin);
        originArray.push(e.word);
      }
    });
    const joinedPinyin = pinyinArray.join(" ");
    completedPinyinArray.push(joinedPinyin);
    completedOriginArray.push(originArray);
  });
  result.listOfPinyin = completedPinyinArray;
  result.listOfOrigin = completedOriginArray;
  return result;
};
