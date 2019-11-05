const articlesRouter = require('express').Router();
const {
	getAllArticles,
	getArticleById,
	patchVotes,
	postComment
} = require('../controllers/articles-controller.js');
const { handle405s } = require('../errors');

articlesRouter
	.route('/')
	.get(getAllArticles)
	.all(handle405s);

articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchVotes)
	.all(handle405s);

articlesRouter
	.route('/:article_id/comments')
	.post(postComment)
	.all(handle405s);

module.exports = articlesRouter;
