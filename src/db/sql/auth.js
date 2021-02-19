module.exports = {
  get: "SELECT * FROM users WHERE id = ($1)",
  // "SELECT * FROM goodjob JOIN goodjob.userId = users.id JOIN goodjob.articleTitle = articles.title WHERE users.id = ($1) ORDER BY articles.date DESC users WHERE id = ($2)",
  // "SELECT users.*, articles.*, posts.* FROM users INNER JOIN goodjob ON users.id=($1)",
  register: "INSERT INTO users(id, nickname) VALUES($1, $2)"
};
