const {
	fetchAllArticles,
	fetchArticleById,
	updateVotes,
	sendComment,
	fetchAllCommentsByArticleId
} = require('../models/articles-model');

exports.getAllArticles = (req, res, next) => {
	fetchAllArticles()
		.then(articles => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	fetchArticleById(article_id)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.patchVotes = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	updateVotes(article_id, inc_votes)
		.then(([updatedArticle]) => {
			res.status(200).send({ updatedArticle });
		})
		.catch(next);
};

exports.postComment = (req, res, next) => {
	const { body, username } = req.body;
	const { article_id } = req.params;
	sendComment(body, username, article_id)
		.then(([postedComment]) => {
			res.status(201).send({ postedComment });
		})
		.catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	fetchAllCommentsByArticleId(article_id)
		.then(comments => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
