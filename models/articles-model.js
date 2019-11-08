const connection = require('../db/connection');
const { checkUser } = require('../models/users-model');
const { checkTopic } = require('../models/topics-model');

exports.fetchAllArticles = (
	sort_by = 'created_at',
	order = 'desc',
	author,
	topic,
	limit,
	offset = 0
) => {
	if (offset > 0) offset = offset * limit - limit;
	return connection('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.select('articles.*')
		.count('comment_id as comment_count')
		.groupBy('articles.article_id')
		.modify(query => {
			if (author) query.where('articles.author', author);
			if (topic) query.where({ topic });
			if (limit) query.limit(limit).offset(offset);
		})
		.orderBy(sort_by, order)
		.then(articles => {
			return articles;
		});
};

exports.fetchArticleById = article_id => {
	return connection('articles')
		.where('articles.article_id', article_id)
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.select(
			'articles.article_id',
			'articles.title',
			'articles.body',
			'articles.topic',
			'articles.author',
			'articles.created_at',
			'articles.votes'
		)
		.count('comment_id as comment_count')
		.groupBy('articles.article_id')
		.then(([article]) => {
			return article === undefined
				? Promise.reject({ status: 404, msg: 'Not Found' })
				: article;
		});
};

exports.updateVotes = (article_id, newVotes) => {
	return connection('articles')
		.where('article_id', article_id)
		.modify(query => {
			if (newVotes) query.increment('votes', newVotes);
		})
		.returning('*');
};

exports.sendComment = (body, author, article_id) => {
	return Promise.all([
		checkUser(author),
		this.fetchArticleById(article_id)
	]).then(() => {
		const comment = { body, article_id, author };
		return connection('comments')
			.insert(comment)
			.returning('*');
	});
};

exports.fetchAllCommentsByArticleId = (
	article_id,
	sort_by = 'created_at',
	order = 'desc',
	limit,
	offset = 0
) => {
	if (offset > 0) offset = offset * limit - limit;
	return connection('comments')
		.select(
			'comments.comment_id',
			'comments.votes',
			'comments.created_at',
			'comments.author',
			'comments.body'
		)
		.modify(query => {
			if (limit) query.limit(limit).offset(offset);
		})
		.where({ article_id })
		.orderBy(sort_by, order);
};
exports.fetchArticleByTopic = slug => {
	return connection('topics')
		.select('*')
		.where({ slug })
		.then(([topic]) => {
			if (!topic) return Promise.reject({ status: 404, msg: 'Not Found' });
		});
};

exports.sendArticle = (topic, title, author, body) => {
	if (!body) return Promise.reject({ status: 404, msg: 'Missing Content' });
	else {
		const article = { topic, title, author, body };
		return Promise.all([checkTopic(topic), checkUser(author)]).then(() => {
			return connection('articles')
				.insert(article)
				.returning('*');
		});
	}
};

exports.removeArticleById = article_id => {
	return connection('articles')
		.del()
		.where({ article_id });
};
