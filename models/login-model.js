const connection = require('../db/connection');

exports.sendLogin = (username, password) => {
	return connection('users')
		.select('*')
		.where({ username })
		.then(([user]) => {
			return !user || password !== user.password
				? Promise.reject({ status: 401, msg: 'Invalid Username or Password' })
				: user;
		});
};
