const {
	fetchAllArticles,
	fetchArticleById,
	updateVotes,
	sendComment,
	fetchAllCommentsByArticleId,
	checkArticleId
} = require('../models/articles-model');

exports.getAllArticles = (req, res, next) => {
	const { sort_by, order, author, topic, limit, p } = req.query;
	fetchAllArticles(sort_by, order, author, topic, limit, p)
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
	return Promise.all([
		checkArticleId(article_id),
		updateVotes(article_id, inc_votes)
	])
		.then(([check, [updatedArticle]]) => {
			res.status(200).send({ updatedArticle });
		})
		.catch(next);
};

exports.postComment = (req, res, next) => {
	const { body, username } = req.body;
	const { article_id } = req.params;
	return Promise.all([
		checkArticleId(article_id),
		sendComment(body, username, article_id)
	])
		.then(([check, [postedComment]]) => {
			res.status(201).send({ postedComment });
		})
		.catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { sort_by, order, limit, p } = req.query;
	return Promise.all([
		checkArticleId(article_id),
		fetchAllCommentsByArticleId(article_id, sort_by, order, limit, p)
	])
		.then(([check, comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
