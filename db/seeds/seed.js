const {
	topicsData,
	articlesData,
	commentsData,
	usersData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
	return knex.migrate
		.rollback()
		.then(() => {
			knex.migrate.latest();
		})
		.then(() => {
			const topicsInsertions = knex('topics').insert(topicsData, '*');
			const usersInsertions = knex('users').insert(usersData, '*');
			return Promise.all([topicsInsertions, usersInsertions]);
		})
		.then(results => {
			const updatedArticlesData = formatDates(articlesData);
			return knex('articles').insert(updatedArticlesData, '*');
		})
		.then(articleRows => {
			const ref = makeRefObj(articleRows, 'article_id', 'title');
			const upDatedComments = formatDates(commentsData);
			const formattedComments = formatComments(upDatedComments, ref);
			return knex('comments').insert(formattedComments);
		});
};
