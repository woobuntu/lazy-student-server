const puppeteer = require("puppeteer");
const pool = require("../../db");
const sql = require("../../db/sql");
const config = require("../../config");

const getF = async () => {
  let url;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--window-size=1920,1080",
        "--disable-notifications",
        "--no-sandbox",
        // "--disable-gpu",
        // "--disable-setuid-sandbox",
        // `--proxy-server=${proxy}`,
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36"
    );
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://www.fnnews.com/section/003001000");
    await page.waitForSelector("#secNo1 > li:nth-child(1) > strong > a");
    const title = await page.evaluate(() => {
      return document.querySelector("#secNo1 > li:nth-child(1) > strong > a")
        .textContent;
    });

    url = await page.evaluate(() => {
      return document
        .querySelector("#secNo1 > li:nth-child(1) > strong > a")
        .getAttribute("href");
    });
    if (!title.includes("fn스트리트")) {
      return console.log("fn스트리트 최신 기사가 없습니다.");
    }

    let originalArticle;
    try {
      originalArticle = await pool.query(sql.news.check, [url]);
    } catch (dbError) {
      return console.log(
        "fn스트리트 기사가 이미 디비에 있는 기사인지 확인 실패",
        dbError
      );
    }

    if (originalArticle.rows.length > 0) {
      return console.log("이미 있는 기사입니다.");
    }

    await page.click("#secNo1 > li:nth-child(1) > strong > a");

    await page.waitForSelector(
      "#container > div > div.article_head > div > em:nth-child(2)"
    );
    const date = await page.evaluate(() => {
      return document
        .querySelector(
          "#container > div > div.article_head > div > em:nth-child(2)"
        )
        .textContent.trim();
      // .slice(11, 17);
    });
    // console.log(date);

    await page.waitForSelector("#article_content");
    const content = await page.evaluate(() => {
      return document
        .querySelector("#article_content")
        .innerText.trim()
        .replace(/\s{2,}/gi, "\n");
    });
    // console.log(content);
    const author = content.slice(-8);
    let articleArray = [];
    let start = 0;
    let end = 0;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === "\n") {
        end = i;
        articleArray.push(content.slice(start, end));
        start = i + 1;
      }
    }
    // console.log("기자? ", author);
    try {
      pool.query(sql.news.newArticle, [
        url,
        title.slice(8).trim(),
        "fn스트리트",
        author.trim(),
        date.slice(6, 17),
        articleArray,
      ]);
      // console.log("fn스트리트 최신 기사 db에 저장 성공");
    } catch (dbError) {
      return console.log("fn스트리트 최신 기사 db에 저장 실패 : ", dbError);
    }
    await page.close();
    await browser.close();
    try {
      const result = await pool.query(sql.news.check, [url]);
      return [`fn스트리트 '${title.slice(8).trim()}'\n`];
      // return result.rows;
    } catch (dbError) {
      return console.log(
        "방금 저장한 fn스트리트 기사 불러오기 실패...?",
        dbError
      );
    }
  } catch (error) {
    return console.log(error);
  }
};

module.exports = getF;
