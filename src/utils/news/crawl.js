const getJ = require("./getJ");
const getC = require("./getC");
const getF = require("./getF");
const notify = require("./notify");

const crawl = async () => {
  const array = [];

  const fnStreet = await getF();
  if (
    Object.prototype.toString.call(fnStreet) === "[object Array]" &&
    fnStreet.length > 0
  ) {
    // console.log(fnStreet);
    array.push(fnStreet);
  }
  const choseon = await getC();
  if (
    Object.prototype.toString.call(choseon) === "[object Array]" &&
    choseon.length > 0
  ) {
    // console.log(choseon);
    array.push(choseon);
  }
  const joongang = await getJ();
  if (
    Object.prototype.toString.call(joongang) === "[object Array]" &&
    joongang.length > 0
  ) {
    // console.log(joongang);
    array.push(joongang);
  }
  // console.log(array);
  if (array.length > 0) {
    return await notify(array);
  }
  process.exit(0);
};

crawl();
