const puppeteer = require("puppeteer");
const config = require("../../config");

// 프록시 : 대리인(남인 척 하는 것)
// 즉, 내 IP가 아닌 다른 사람의 IP로 요청을 보내는 것
// http://spys.one/free-proxy-list/KR/
// 프록시가 생겼다 사라졌다하고 각각 속도도 다르기 때문에 아예 이 사이트 자체를 크롤링해서 가장 빠른 걸 고르자
// anonymity가 NOA면 프록시를 써도 다 들통남;;
// 안 들키고 싶은거라면 HIA 또는 ANM을 씁시다
// 스피드는 빠를 수록, latentcy는 낮을수록 좋은 것
// body > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(4) > td:nth-child(1) > font
module.exports = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: config.headLess,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("http://spys.one/free-proxy-list/KR/");
    const proxies = await page.evaluate(() => {
      const ips = Array.from(
        document.querySelectorAll("tr > td:first-of-type > .spy14")
      ).map((v) => v.textContent.replace(/document\.write\(.+\)/, ""));

      // body > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(4) > td:nth-child(1) > font
      // body > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(5) > td:nth-child(1) > font
      // body > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(33) > td:nth-child(1) > font
      const types = Array.from(
        document.querySelectorAll("tr > td:nth-of-type(2)")
      )
        .slice(5)
        .map((v) => v.textContent);

      const anonymity = Array.from(
        document.querySelectorAll("tr> td:nth-of-type(3)")
      )
        .slice(4)
        .map((v) => v.textContent);

      const latencies = Array.from(
        document.querySelectorAll("tr > td:nth-of-type(6) .spy1")
      ).map((v) => v.textContent);

      return ips.map((v, i) => {
        return {
          ip: v,
          type: types[i],
          anonymity: anonymity[i],
          latency: latencies[i],
        };
      });
    });
    const filtered = proxies
      .filter((v) => {
        if (v.type.startsWith("HTTP")) {
          return v;
        }
      })
      .sort((p, c) => p.latency - c.latency);
    await page.close();
    await browser.close();
    return filtered[0].ip;
  } catch (error) {
    return console.log(error);
  }
};
