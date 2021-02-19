const pool = require("../../db");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const axios = require("axios");
const sql = require("../../db/sql");

const kakaoLogin = async (req, res) => {
  const { KAKAO_TOKEN } = req.body;

  let kakaoUser;

  // 1.클라이언트에서 받은 KAKAO_TOKEN으로 카카오에 유저 정보 요청
  try {
    kakaoUser = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${KAKAO_TOKEN}`,
        "Content-type": "application/x-www-form urlencoded;charset=utf-8",
      },
    });
    // console.log("카카오서버로부터 유저 정보 수신 성공", kakaoUser.data);
  } catch (apiError) {
    console.log("카카오서버로부터 유저 정보 수신 실패", apiError);
    return res.status(500).json({
      error: "카카오서버로부터 유저 정보를 받는데 실패하였습니다.",
    });
  }

  const {
    id,
    properties: { nickname },
  } = kakaoUser.data;

  // 2.카카오에서 받아온 유저 정보가 데이터베이스에 이미 있는 정보인지 확인
  let dbUser;
  try {
    dbUser = await pool.query(sql.auth.get, [id]);
    // console.log("데이터베이스에 유저 정보가 있는지 확인 : ", dbUser.rows);
  } catch (dbError) {
    console.log(
      "데이터베이스에서 유저 정보를 조회하는 과정에서 오류 발생 : ",
      dbError
    );
    return res.status(500).json({
      error: "데이터베이스에서 유저 정보를 조회하는 과정에서 오류 발생",
    });
  }

  // 3.데이터베이스에 이미 있는 유저라면 클라이언트로 유저 정보 바로 반환
  if (dbUser.rows.length >= 1) {
    // 쿠키에 저장할 토큰 생성
    const token = jwt.sign({ id: dbUser.rows[0].id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    // 로컬 스토리지에 저장할 유저 정보
    const { id, nickname } = dbUser.rows[0];
    return res.status(200).json({
      token,
      user: { id, nickname },
    });
  }

  // 4.데이터베이스에 없는 유저라면 저장
  if (dbUser.rows.length === 0) {
    try {
      await pool.query(sql.auth.register, [id, nickname]);
      console.log("데이터베이스에 유저 정보 추가 성공");
    } catch (dbError) {
      console.log("데이터베이스에 유저 정보 추가 실패", dbError);
      return res.status(500).json({
        error: "데이터베이스에서 유저 정보를 받아오는 데 실패하였습니다.",
      });
    }
    let savedUser;
    const ID = id;
    try {
      savedUser = await pool.query(sql.auth.get, [ID]);
      // console.log("데이터베이스에 유저 정보 추가 성공", savedUser.rows);
      // 쿠키에 저장할 토큰 생성
      const token = jwt.sign({ id: savedUser.rows[0].id }, config.JWT_SECRET, {
        expiresIn: "7d",
      });
      // 로컬스토리지에 저장할 유저 정보 호출
      const { id, nickname } = savedUser.rows[0];
      return res.status(200).json({
        token,
        user: { id, nickname },
      });
    } catch (dbError) {
      console.log("데이터베이스에서 유저 정보 수신 실패 : ", dbError);
      return res.status(500).json({
        error: "데이터베이스에서 유저 정보를 받아오는 데 실패하였습니다.",
      });
    }
  }
};

module.exports = kakaoLogin;
