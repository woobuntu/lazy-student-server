module.exports = text => {
  let start = 0;
  let end;
  const arrayOfSentences = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "·" && text[i + 1] === "·" && text[i + 2] === "·") {
      if (text[i + 3] === "·" && text[i + 4] === "·" && text[i + 5] === "·") {
        end = i + 5;
        const slicedSentence = text.slice(start, end + 1);
        arrayOfSentences.push(slicedSentence);
        start = end + 1;
        continue;
      }
      end = i + 2;
      const slicedSentence = text.slice(start, end + 1);
      arrayOfSentences.push(slicedSentence);
      start = end + 1;
      continue;
    }
    if (
      text[i] === "？" ||
      text[i] === "?" ||
      text[i] === "。" ||
      text[i] === "." ||
      text[i] === "!" ||
      text[i] === "！" ||
      text[i] === "：" ||
      text[i] === ":" ||
      text[i] === "；" ||
      text[i] === ";"
    ) {
      end = i;
      const slicedSentence = text.slice(start, end + 1);
      arrayOfSentences.push(slicedSentence);
      start = end + 1;
      continue;
    }
    if (i === text.length - 1) {
      const slicedSentence = text.slice(start, text.length);
      arrayOfSentences.push(slicedSentence);
    }
  }
  return arrayOfSentences;
};
