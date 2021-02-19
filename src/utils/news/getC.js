const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("../../db");
const sql = require("../../db/sql");

module.exports = async () => {
  let raw;

  // 만물상 페이지 긁어오기
  try {
    raw = await axios({
      method: "get",
      url: "https://news.chosun.com/svc/list_in/list.html?catid=61",
    });
  } catch (crawlError) {
    return console.log("만물상 페이지 긁어오기 실패 : ", crawlError);
  }

  if (raw.status === 200) {
    // console.log("만물상 페이지 긁기 성공");

    const html = raw.data;
    const $ = cheerio.load(html);

    // 가장 최신 기사
    const link = $(
      "#list_body_id > div.list_content > dl:nth-child(1) > dt > a"
    );
    const title = link.text().slice(5).trim();
    const date = $(
      "#list_body_id > div.list_content > dl:nth-child(1) > dd.date_author > span.date"
    )
      .text()
      .slice(0, 10);

    const url = `https:${link.attr("href")}`;

    //url을 기준으로 db에 이미 있는 기사인지 판별
    let checkResult;
    try {
      checkResult = await pool.query(sql.news.check, [url]);
    } catch (dbError) {
      return console.log("만물상 최신 글이 db에 있는지 조회 실패 : ", dbError);
    }

    if (checkResult.rows.length > 0) {
      return console.log("db에 반영할 만물상의 최신 기사가 없습니다.");
    }

    //db에 없는 기사임을 확인했으니 기사 세부 내용 긁어오기
    let innerRaw;
    try {
      innerRaw = await axios({ method: "get", url });
    } catch (crawlError) {
      return console.log(
        "만물상 최신 기사 세부 내용 긁어오기 실패 : ",
        crawlError
      );
    }

    if (innerRaw.status === 200) {
      // console.log("만물상 최신 기사 긁어오기 성공");

      const innerHtml = innerRaw.data;
      const $ = cheerio.load(innerHtml);
      const author = $("#csContent > header > div > div > ul > li > a").text();
      const articleContent = $("#news_body_id")
        .text()
        .trim()
        .replace(/▶/g, "  ")
        .replace(/\s{2,}/gi, "\n");
      let articleArray = [];
      let start = 0;
      let end = 0;
      for (let i = 0; i < articleContent.length; i++) {
        if (articleContent[i] === "\n") {
          end = i;
          articleArray.push(articleContent.slice(start, end));
          start = i + 1;
        }
      }

      //기사 내용 db에 저장
      try {
        await pool.query(sql.news.newArticle, [
          url,
          title,
          "만물상",
          author,
          date,
          articleArray.slice(1, articleArray.length - 2),
        ]);
        // console.log("만물상 최신 기사 db에 저장 성공");
        try {
          const result = await pool.query(sql.news.check, [url]);
          return [`만물상 '${title}',\n`];
        } catch (dbError) {
          return console.log(
            "방금 저장한 만물상 기사 불러오기 실패...?",
            dbError
          );
        }
      } catch (dbError) {
        return console.log("만물상 최신 기사 db에 저장 실패 : ", dbError);
      }
    } else {
      return console.log("만물상 최신 기사 세부내용 긁어오기 실패(왜죠?)");
    }
  }
};
