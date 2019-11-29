const {
  updateCommentById,
  removeCommentById,
  checkCommentId
} = require("../models/comments-model");
const { fetchUserById } = require("../models/users-model");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes, body } = req.body;
  return Promise.all([
    updateCommentById(comment_id, inc_votes, body),
    checkCommentId(comment_id)
  ])
    .then(([[comment]]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return Promise.all([
    checkCommentId(comment_id),
    removeCommentById(comment_id)
  ])
    .then(response => {
      return res.status(204).send();
    })
    .catch(next);
};
