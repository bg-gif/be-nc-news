const connection = require('../db/connection');

exports.fetchAllTopics = () => {
	return connection('topics').select('*');
};

exports.checkTopic = slug => {
	return connection('topics')
		.select('*')
		.where({ slug })
		.then(([topic]) => {
			if (!topic) {
				return Promise.reject({ status: 400, msg: 'Bad Request' });
			}
		});
};
