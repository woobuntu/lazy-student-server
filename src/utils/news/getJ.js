const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("../../db");
const sql = require("../../db/sql");

module.exports = async () => {
  // 분수대 페이지 긁어오기
  let raw;
  try {
    raw = await axios({
      method: "get",
      url:
        "https://news.joins.com/find/list?keyword=%22%ubd84%uc218%ub300%22&SearchCategoryType=IssueNews",
    });
  } catch (crawlError) {
    return console.log("분수대 페이지 긁어오기 실패 : ", crawlError);
  }
  if (raw.status === 200) {
    // console.log("분수대 페이지 긁어오기 성공");
    const html = raw.data;
    const $ = cheerio.load(html);
    const link = $("#content > div.list_basic > ul > li:nth-child(1) > h2 > a");
    const date = $(
      "#content > div.list_basic > ul > li:nth-child(1) > span.byline > em:nth-child(2)"
    )
      .text()
      .slice(0, 10);
    const title = link.text().slice(5).trim();
    const url = `https://news.joins.com${link.attr("href")}`;

    //url을 기준으로 db에 이미 있는 기사인지 판별
    let checkResult;
    try {
      checkResult = await pool.query(sql.news.check, [url]);
    } catch (dbError) {
      return console.log("분수대 최신 글이 db에 있는지 조회 실패 : ", dbError);
    }

    if (checkResult.rows.length > 0) {
      return console.log("db에 반영할 분수대의 최신 기사가 없습니다.");
    }

    //db에 없는 기사임을 확인했으니 기사 세부 내용 긁어오기
    let innerRaw;
    try {
      innerRaw = await axios({ method: "get", url });
    } catch (crawlError) {
      return console.log(
        "분수대 최신 기사 세부 내용 긁어오기 실패 : ",
        crawlError
      );
    }

    if (innerRaw.status === 200) {
      // console.log("분수대 최신 기사 긁어오기 성공");
      const innerHtml = innerRaw.data;
      const $ = cheerio.load(innerHtml);
      const author = $(
        "#content > div.journalist_area > div > dl > dd > span > strong > a"
      ).text();
      const articleContent = $("#article_body")
        .text()
        .trim()
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
          "분수대",
          author,
          date,
          articleArray.slice(1),
        ]);
        // console.log("분수대 최신 기사 db에 저장 성공");
        try {
          const result = await pool.query(sql.news.check, [url]);
          return [`분수대 '${title}'\n`];
          // return result.rows;
        } catch (dbError) {
          return console.log(
            "방금 저장한 분수대 기사 불러오기 실패...?",
            dbError
          );
        }
      } catch (dbError) {
        return console.log("분수대 최신 기사 db에 저장 실패 : ", dbError);
      }
    } else {
      return console.log("분수대 최신 기사 세부내용 긁어오기 실패(왜죠?)");
    }
  }
};
