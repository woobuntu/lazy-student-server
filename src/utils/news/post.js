const pool = require("../../db");
const sql = require("../../db/sql");
const { uuid } = require("uuidv4");

module.exports = async (req, res) => {
  const { id } = req.user;
  const { articleUrl, postTitle, postContent } = req.body;
  const postId = uuid();
  // 1.포스팅 내용 저장
  try {
    await pool.query(sql.news.post, [postId, postTitle, postContent]);
  } catch (dbError) {
    console.log(`포스팅에 실패 : ${dbError}`);
    return res.status(500).json({
      error: "데이터베이스에 포스팅 내용을 저장하는데 실패",
    });
  }
  // 2.기사-유저-포스팅 엮기
  try {
    await pool.query(sql.news.join, [id, articleUrl, postId]);
  } catch (dbError) {
    console.log(`기사-유저-포스팅 엮기 실패 : ${dbError}`);
    return res.status(500).json({
      error: "데이터베이스에 관계 구축 실패",
    });
  }

  try {
    const result = await pool.query(sql.news.getWhatIPosted, [postId]);
    res.status(200).json({
      data: result.rows,
    });
  } catch (dbError) {
    console.log(dbError);
    return res.status(500).json({
      error: "관계 불러오기 실패",
    });
  }
};
