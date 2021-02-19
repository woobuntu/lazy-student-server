const pool = require("../../db");
const sql = require("../../db/sql");
module.exports = async (req, res) => {
  //모든 기사 긁어오기
  try {
    const data = await pool.query(sql.news.getNews);
    res.status(200).json({
      data: data.rows,
    });
  } catch (dbError) {
    res.status(500).json({
      error: dbError,
    });
  }
};
