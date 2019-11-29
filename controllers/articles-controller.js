const {
  fetchAllArticles,
  fetchArticleById,
  updateVotes,
  sendComment,
  fetchAllCommentsByArticleId,
  fetchArticleByTopic,
  sendArticle,
  removeArticleById
} = require("../models/articles-model");
const { checkUser } = require("../models/users-model");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;
  if (author) {
    return Promise.all([
      fetchAllArticles(sort_by, order, author, topic, limit, p),
      checkUser(author)
    ])
      .then(([articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else if (topic) {
    return Promise.all([
      fetchAllArticles(sort_by, order, author, topic, limit, p),
      fetchArticleByTopic(topic)
    ])
      .then(([articles]) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    return fetchAllArticles(sort_by, order, author, topic, limit, p)
      .then(articles => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.getArticleById = (req, res, next) => {
  const { article_id, order, author } = req.params;
  fetchArticleById(article_id, order, author)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return Promise.all([
    updateVotes(article_id, inc_votes),
    fetchArticleById(article_id)
  ])
    .then(([[article]]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { body, username } = req.body;
  const { article_id } = req.params;

  return Promise.all([
    sendComment(body, username, article_id),
    fetchArticleById(article_id),
    checkUser(username)
  ])
    .then(([[comment]]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { author, sort_by, order, limit, p } = req.query;
  return Promise.all([
    fetchAllCommentsByArticleId(article_id, sort_by, order, author, limit, p),
    fetchArticleById(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.postArticle = (req, res, next) => {
  const { topic, title, author, body } = req.body;
  sendArticle(topic, title, author, body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    (removeArticleById(article_id), fetchArticleById(article_id))
  ])
    .then(() => {
      console.log("here");
      res.status(204).send();
    })
    .catch(next);
};
