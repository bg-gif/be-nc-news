const connection = require('../db/connection');

exports.fetchAllUsers = () => {
	return connection('users').select('*');
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
		return Promise.reject({ status: 400, msg: 'User Not Found' });
	}
	return connection('users')
		.where({ username })
		.then(([user]) => {
			if (!user) {
				return Promise.reject({ status: 400, msg: 'User Not Found' });
			}
		});
};
