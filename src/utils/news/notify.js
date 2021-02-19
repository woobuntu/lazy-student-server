const puppeteer = require("puppeteer");
const config = require("../../config");

const notify = async (array) => {
  // console.log(array);
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--window-size=1440,900",
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
    const pageTarget = page.target();
    await page.setViewport({
      width: 1440,
      height: 900,
    });

    await page.goto(
      "https://accounts.kakao.com/login/kakaoforbusiness?continue=https%3A%2F%2Fbusiness.kakao.com%2Finfo%2Fkakaotalkchannel%2F"
    );
    // await page.evaluate(
    //   (id, password) => {
    //     document.querySelector("#id_email_2").value = "boutime2017@gmail.com";
    //     document.querySelector("#id_password_3").value = "rkqsidn0807";
    //     document
    //       .querySelector("#login-form > fieldset > div.wrap_btn > button")
    //       .click();
    //   },
    //   config.kakaoChannel.id,
    //   config.kakaoChannel.password
    //   //evaluate내부는 자바스크립트 스코프를 따르지 않기 때문에 이와 같이 인자로 넘겨준다.
    // );

    //카카오채널 로그인
    await page.type("#id_email_2", config.kakaoChannel.id);
    await page.type("#id_password_3", config.kakaoChannel.password);
    await page.hover("#login-form > fieldset > div.wrap_btn > button");
    await page.waitForSelector(
      "#login-form > fieldset > div.wrap_btn > button"
    );
    await page.click("#login-form > fieldset > div.wrap_btn > button");

    //카카오톡 채널 시작하기 누르기
    await page.waitForSelector("#mFeature > div.wrap_buttons.btn_service > a");
    await page.click("#mFeature > div.wrap_buttons.btn_service > a");
    //만약 click이 잘 안 먹는 경우는 아래와 같이 하면 된다.
    // await page.evaluate(() => {
    //   document
    //     .querySelector("#mFeature > div.wrap_buttons.btn_service > a")
    //     .click();
    // });

    // 새 탭이 열려서 안 되는 것 같음...
    const newTarget = await browser.waitForTarget(
      (target) => target.opener() === pageTarget
    );
    const newPage = await newTarget.page();

    await newPage.waitForSelector(
      "#mArticle > div:nth-child(3) > div > div.wrap_tbl > table > tbody > tr:nth-child(2) > td.align_r > button"
    );

    await newPage.click(
      "#mArticle > div:nth-child(3) > div > div.wrap_tbl > table > tbody > tr:nth-child(2) > td.align_r > button"
    );

    const brandNewTarget = await browser.waitForTarget(
      (target) => target.opener() === newTarget
    );
    const brandNewPage = await brandNewTarget.page();
    await brandNewPage.setViewport({
      width: 1440,
      height: 900,
    });

    await brandNewPage.waitForSelector(
      "#mArticle > div.message_main > ul > li:nth-child(1) > button"
    );
    await brandNewPage.waitFor(2000);
    await brandNewPage.click(
      "#mArticle > div.message_main > ul > li:nth-child(1) > button"
    );
    await brandNewPage.waitForSelector("#messageWrite");
    await brandNewPage.focus("#messageWrite");
    for (const element of array) {
      await brandNewPage.type("#messageWrite", element);
    }
    await brandNewPage.type("#messageWrite", "이(가) 올라왔습니다!");
    await brandNewPage.click(
      "#mArticle > div > form > div.message_write.message_new > div.info_message.type_scroll > div:nth-child(4) > div > div > div:nth-child(4) > label > span"
    );
    await brandNewPage.type("#btnName", "최신 칼럼");
    await brandNewPage.focus("#linkUpload");
    // await brandNewPage.evaluate(url => {
    //   document.querySelector("#linkUpload").value = url;
    // }, "https://lazy-student.co.kr/news");
    await brandNewPage.waitFor(1000);
    await brandNewPage.evaluate(() => {
      document.querySelector("#linkUpload").value =
        "https://lazy-student.co.kr/news";
    });

    await brandNewPage.click(
      "#mArticle > div > form > div.wrap_btn > span > div > button.btn_g.btn_g2"
    );

    await brandNewPage.waitForSelector(
      "#mArticle > div > form > div.wrap_btn > button.btn_g.btn_g2"
    );
    await brandNewPage.click(
      "#mArticle > div > form > div.wrap_btn > button.btn_g.btn_g2"
    );

    await brandNewPage.waitForSelector(
      "body > div:nth-child(9) > div:nth-child(2) > div > div > div.wrap_btn > button.btn_g.btn_g2"
    );
    await brandNewPage.click(
      "body > div:nth-child(9) > div:nth-child(2) > div > div > div.wrap_btn > button.btn_g.btn_g2"
    );
    //로그아웃
    // await page.waitForSelector(
    //     "#kakaoHead > div.head_wrap > div > div.menu_my > a"
    //   );
    // await page.click("#kakaoHead > div.head_wrap > div > div.menu_my > a");
    // await page.waitForSelector(
    //   "#kakaoHead > div.head_wrap > div > div.menu_my.on > ul > li:nth-child(1) > a"
    // );
    // await page.click(
    //   "#kakaoHead > div.head_wrap > div > div.menu_my.on > ul > li:nth-child(1) > a"
    // );
    // await page.keyboard.press("Escape");
    //혹시 까만 화면 나오면 esc눌러주면 댐

    // #id_email_2
    // #id_password_3
    // #login-form > fieldset > div.wrap_btn > button

    await page.close();
    await browser.close();
    process.exit(0);
  } catch (error) {
    return console.log(error);
  }
};
module.exports = notify;
