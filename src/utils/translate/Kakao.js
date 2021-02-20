const request = require('request-promise-native');

const headers = {
  Connection: 'keep-alive',
  Accept: '*/*',
  'Sec-Fetch-Dest': 'empty',
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Origin: 'https://translate.kakao.com',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  Referer: 'https://translate.kakao.com/',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  Cookie:
    '_ga=GA1.2.1701784444.1581757850; _kadu=YsQapt69FspN6iRb_1581757876636; webid=f73cc7de872043119c66616bafb5df2a; _kdtd=eyJrZWVwLXVzZXItaWQiOnRydWV9; _gid=GA1.2.1366074678.1584327922; _kawlt=i1ff3VAh4QdiKw2yd_MiD3s0emyxfM_CnvBFx3mTmhIjnXcO4HSU8frT2Jh04EemYYDBMePFjimS_80PmU7jplNtiT8RZMJclSBK_PIs0ZBkztnPBKm8ITrArAlh0zus; _kawltea=1584407516; _karmt=DDaoe3gPaxPIwU83wW04ULA9vMdw_V_w20sIGXPUmfKULxD9C2gO_vJ5RT8rwDCx; _karmtea=1584418316; _kdt=3iWiIpovA4mpxfYWJWJbc1vimiHwluTyn1vUt3O7r4SyYognhrCbWxfUNOVSCZPPDoRFnLGtsLnhJYXSPhJnYg; TIARA=d.qNpcCF4oLD._2LMqyQJberYr2wkuBwZ8D12YM3Jnku-76IgI9Rf9UooCqeuhDyGiAtDsT4ZDJIV9Q2lt82t5qg88zT4.V-',
};

module.exports = async text => {
  const array = [];
  try {
    for (const element of text) {
      const dataString = `queryLanguage=cn&resultLanguage=kr&q=${element}`;
      const options = {
        url: 'https://translate.kakao.com/translator/translate.json',
        method: 'POST',
        headers: headers,
        body: dataString,
      };
      const curlResult = await request(options);
      const jsonResult = await JSON.parse(curlResult).translateResult
        .translatedText;
      array.push(jsonResult);
    }
  } catch (curlError) {
    console.log(curlError);
  }
};
