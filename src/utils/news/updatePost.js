const pool = require("../../db");
const sql = require("../../db/sql");

module.exports = async (req, res) => {
  const { postId, postTitle, postContent } = req.body;
  try {
    await pool.query(sql.news.update, [postTitle, postContent, postId]);
  } catch (dbError) {
    console.log(dbError);
    return res.status(500).json({
      error: dbError,
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
