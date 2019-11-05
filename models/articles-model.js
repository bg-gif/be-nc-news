const connection = require('../db/connection');

exports.fetchAllArticles = () => {
	return connection('articles').select('*');
};

exports.fetchArticleById = article_id => {
	return connection('articles')
		.where('articles.article_id', article_id)
		.join('comments', 'articles.article_id', 'comments.article_id')
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
				? Promise.reject({ status: 404, msg: 'Article does not exist' })
				: article;
		});
};

exports.updateVotes = (article_id, newVotes) => {
	return connection('articles')
		.where('article_id', article_id)
		.increment('votes', newVotes)
		.returning('*');
};
