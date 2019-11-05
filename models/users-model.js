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
