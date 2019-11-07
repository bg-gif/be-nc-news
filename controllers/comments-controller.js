const {
	updateCommentById,
	removeCommentById,
	checkCommentId
} = require('../models/comments-model');

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	return Promise.all([
		checkCommentId(comment_id),
		updateCommentById(comment_id, inc_votes)
	])
		.then(([check, [updatedComment]]) => {
			res.status(200).send({ updatedComment });
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
