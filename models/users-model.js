const connection = require('../db/connection');

exports.fetchAllUsers = () => {
	return connection('users').select('*');
};

exports.fetchUserById = username => {
	return connection('users')
		.select('*')
		.where({ username })
		.then(response => {
			return response.length === 0
				? Promise.reject({ status: 404, msg: 'User does not exist' })
				: response;
		});
};
