const connection = require("../db/connection");

exports.updateCommentById = (comment_id, newVotes) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .modify(query => {
      if (newVotes) query.increment("votes", newVotes);
    })
    .returning("*");
};

exports.removeCommentById = comment_id => {
  return connection("comments")
    .del()
    .where("comment_id", comment_id);
};

exports.checkCommentId = comment_id => {
  return connection("comments")
    .select("*")
    .where({ comment_id })
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, msg: "Not Found" });
    });
};

exports.fetchCommentsByUserId = author => {
  return connection("comments")
    .select("*")
    .where("author", author);
};
