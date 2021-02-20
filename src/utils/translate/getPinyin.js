const axios = require('axios');
const _ = require('fxjs/Strict');
const L = require('fxjs/Lazy');
const C = require('fxjs/Concurrency');

const headers = {
  authority: 'zh.dict.naver.com',
  accept: 'application/json, text/javascript, */*; q=0.01',
  'alldict-locale': 'ko',
  'sec-fetch-dest': 'empty',
  'x-requested-with': 'XMLHttpRequest',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'cors',
  referer: 'https://zh.dict.naver.com/',
  'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  cookie:
    'NNB=SL3XKDQL3JDF4; NRTK=ag#all_gr#1_ma#-2_si#0_en#0_sp#0; IS_PLATFORM_ENKODICT_USER=true; nx_ssl=2; focusInputBox=dicQuery; dicLangType=endic; _ga_4BKHBFKFK0=GS1.1.1582906551.1.1.1582906551.60; zhac_reword=false; nid_inf=-979657198; NID_AUT=1pb9dRJrAh+Om+xRqRKxGvqeF34P7FY9sRjiIqvsID8PUk/XgdgDpGzsN4hfbQL/; NID_JKL=ke2Xg4oF+qaUEwJ31HSBHbewn8kuQ7egr+QbugfXQRQ=; _gid=GA1.2.114654638.1584327762; _ga=GA1.1.1224745923.1582038213; _ga_7VKFYR6RV1=GS1.1.1584327761.5.1.1584328829.60; nid_tct=000nbTfFKEodWPE1; page_uid=UE8rFdp0YidsslBqYU8sssssspd-202388; NID_SES=AAABiyMwmqM9/o3/l6XI12L1OGGD6Y3cNocC5gKnDgNjdXqbTCEwjkKgZsG/GO0rXsTpgRQ7Cf1WwpW+v5UrPNsJscEOpmosL/nW5yVXUR6RdasBwN/MZFH6eBOXy8m2ZWyLGWslMbRq77NVQ4FRSg6WcZBbWDyPLTP+NfF3lzfy7IwSpsM0PXfh9nOoNMXAAbqRl5pixmoYEjOKMaNJvT3K6meio+w3yCRlmH95+aySvg8BiSj0qMRlCdOzp3d+4NUBMw9fOJ+DxAmI5jIg/Kz2EyN+2QNIIDDZ2aQyeL7IyIo4OXy0Ot6GHOxGZP/o7Nrz2Yr7muNeVH4lXpPTQHPrer5JIx6FHPlFBKxVokV910+JDXhzijw2C7TKeRWUN7ZjIAIlqhCcRsSQ6zM/T516YAz8x8G4jppi1OmOMY5hh/W9PuAaZWsDTUCQmtnicoDuADtbdGd8GG3GU4+NAFlZpVsMBZFnGw7E8OOrZMC7R0DqsWjDIAG4ingeaTXPN0ORnOxKa5L8U7iLzyabHncE3Bc=; BMR=s=1584347640770&r=https%3A%2F%2Fm.blog.naver.com%2FPostView.nhn%3FblogId%3Dsuin2_91%26logNo%3D221157606767%26proxyReferer%3Dhttps%253A%252F%252Fwww.google.com%252F&r2=https%3A%2F%2Fwww.google.com%2F; JSESSIONID=3AE20EE872599CF053C5FE8D1AD00CDD',
};

const makingAxiosOptions = (domain, query, headers) => ({
  url: `${domain}?query=${encodeURI(query)}`,
  headers,
});

const getPinyin = _.pipe(
  L.map(sentence =>
    makingAxiosOptions(
      'https://zh.dict.naver.com/api3/zhko/articleAnalyzer',
      sentence,
      headers,
    ),
  ),
  L.map(options => axios(options)),
  C.map(
    ({
      data: {
        analizedSentence: { breakedWordList },
      },
    }) => breakedWordList,
  ),
);

module.exports = getPinyin;
