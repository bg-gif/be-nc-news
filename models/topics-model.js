const connection = require('../db/connection');

exports.fetchAllTopics = () => {
	return connection('topics').select('*');
};

exports.checkTopic = slug => {
	if (!slug) return Promise.reject({ status: 400, msg: 'Missing Topic' });
	return connection('topics')
		.select('*')
		.where({ slug })
		.then(([topic]) => {
			if (!topic) {
				return Promise.reject({ status: 400, msg: 'Bad Request' });
			}
		});
};

exports.sendTopic = (slug, description) => {
	return connection('topics')
		.insert({ slug, description })
		.returning('*');
};
