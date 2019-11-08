const articlesRouter = require('express').Router();
const {
	getAllArticles,
	getArticleById,
	patchVotes,
	postComment,
	getAllCommentsByArticleId,
	postArticle,
	deleteArticleById
} = require('../controllers/articles-controller.js');
const { handle405s } = require('../errors');

articlesRouter
	.route('/')
	.get(getAllArticles)
	.post(postArticle)
	.all(handle405s);

articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.delete(deleteArticleById)
	.patch(patchVotes)
	.all(handle405s);

articlesRouter
	.route('/:article_id/comments')
	.get(getAllCommentsByArticleId)
	.post(postComment)
	.all(handle405s);

module.exports = articlesRouter;
