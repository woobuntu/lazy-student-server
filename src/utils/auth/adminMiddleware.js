// 이 미들웨어는 requireSignin미들웨어 다음에 실행될 것이므로 req객체 안에 user객체가 포함되어 있다고 전제한다.
module.exports = async (req, res) => {
  // 여기서 next는 콜백 함수이다.
  // 근데 콜백 함수가 왜 있는거임... 한 번도 안 쓰면서
  // update함수를 콜백으로 받는건가 도통 모르겠네
  let user;
  try {
    user = await pool.query("SELECT * FROM users WHERE id = ($1)", [
      req.user.id,
    ]);
  } catch (dbError) {
    return res.status(500).json({
      error: dbError,
    });
  }
  if (user.rows.length === 0) {
    return res.status(400).json({
      error: "유저가 존재하지 않습니다.",
    });
  }
  if (user.rows[0].role !== "admin") {
    return res.status(400).json({
      error: "Admin resource. Access denied",
    });
  }
};
