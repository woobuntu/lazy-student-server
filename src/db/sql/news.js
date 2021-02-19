module.exports = {
  check: "SELECT url FROM articles WHERE url = ($1)",
  newArticle:
    "INSERT INTO articles(url, title, class, author, date, content) VALUES($1, $2, $3, $4, $5, $6)",
  getNews: "SELECT * FROM articles ORDER BY date DESC",
  isLogined:
    // "SELECT * FROM articles LEFT JOIN goodjob ON articles.url = goodjob.articleUrl AND goodjob.userId=($1) LEFT JOIN posts ON goodjob.postId = posts.id ORDER BY articles.date DESC",
    "SELECT articles.*, goodjob.*, posts.* FROM articles LEFT JOIN goodjob ON articles.url = goodjob.articleUrl AND goodjob.userId=($1) LEFT JOIN posts ON goodjob.postId = posts.postId ORDER BY articles.date DESC",
  post:
    "INSERT INTO posts(postId, postTitle, postContent, created_date) VALUES($1, $2, $3, NOW())",
  update:
    "UPDATE posts SET postTitle=($1), postContent=($2), modified_date=NOW() WHERE postId = ($3)",
  join: "INSERT INTO goodjob(userId, articleUrl, postId) VALUES($1, $2, $3)",
  getWhatIPosted: "SELECT * FROM posts WHERE posts.postId = ($1)",
};
