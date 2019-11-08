const connection = require('../db/connection');

exports.fetchAllUsers = name => {
	return connection('users')
		.modify(query => {
			if (name) {
				query.where({ name });
			}
		})
		.select('*')
		.returning('*')
		.then(response => {
			return response.length === 0
				? Promise.reject({ status: 404, msg: 'Not Found' })
				: response;
		});
};

exports.fetchUserById = (username = 'placeholder') => {
	return connection('users')
		.select('*')
		.where('username', username)
		.then(response => {
			return response.length === 0
				? Promise.reject({ status: 404, msg: 'Not Found' })
				: response;
		});
};

exports.checkUser = username => {
	if (!username) {
		return Promise.reject({ status: 404, msg: 'User Not Found' });
	}
	return connection('users')
		.where({ username })
		.then(([user]) => {
			if (!user) {
				return Promise.reject({ status: 400, msg: 'User Not Found' });
			}
		});
};

exports.sendUser = (username, avatar_url, name) => {
	return connection('users')
		.insert({ username, avatar_url, name })
		.returning('*');
};
