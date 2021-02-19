module.exports = sentences => {
  const result = sentences.map(element => {
    const array = [];
    for (let i = 0; i < element.length; i++) {
      array.push(element[i].word);
    }
    return array;
  });
  return result;
};
