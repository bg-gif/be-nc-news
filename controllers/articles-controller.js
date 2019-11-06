const {
	fetchAllArticles,
	fetchArticleById,
	updateVotes,
	sendComment,
	fetchAllCommentsByArticleId
} = require('../models/articles-model');

exports.getAllArticles = (req, res, next) => {
	const { sort_by, order, author, topic } = req.query;
	fetchAllArticles(sort_by, order, author, topic)
		.then(articles => {
			res.status(200).send({ articles });
		})
		.catch(next);
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
	updateVotes(article_id, inc_votes)
		.then(([updatedArticle]) => {
			return updatedArticle === undefined
				? Promise.reject({ status: 404, msg: 'Not Found' })
				: res.status(200).send({ updatedArticle });
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
	const { sort_by, order } = req.query;
	return fetchArticleById(article_id)
		.then(() => {
			fetchAllCommentsByArticleId(article_id, sort_by, order).then(comments => {
				res.status(200).send({ comments });
			});
		})
		.catch(next);
};
