const commentsRouter = require('express').Router();
const {
	patchCommentById,
	deleteCommentById
} = require('../controllers/comments-controller.js');
const { handle405s } = require('../errors');

commentsRouter
	.route('/:comment_id')
	.patch(patchCommentById)
	.delete(deleteCommentById)
	.all(handle405s);

module.exports = commentsRouter;
