const {
	updateCommentById,
	removeCommentById,
	checkCommentId
} = require('../models/comments-model');

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	return Promise.all([
		updateCommentById(comment_id, inc_votes),
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
