const {
	updateCommentById,
	removeCommentById
} = require('../models/comments-model');

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	updateCommentById(comment_id, inc_votes)
		.then(([updatedComment]) => {
			return updatedComment === undefined
				? Promise.reject({ status: 404, msg: 'Not Found' })
				: res.status(200).send({ updatedComment });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(response => {
			return response === 0
				? Promise.reject({ status: 404, msg: 'Not Found' })
				: res.status(204).send();
		})
		.catch(next);
};
