const {
	fetchAllUsers,
	fetchUserById,
	sendUser
} = require('../models/users-model');

exports.getAllUsers = (req, res, next) => {
	const { name } = req.query;
	fetchAllUsers(name)
		.then(users => {
			res.status(200).send({ users });
		})
		.catch(next);
};

exports.getUserById = (req, res, next) => {
	const { username } = req.params;
	fetchUserById(username)
		.then(([user]) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

exports.postUser = (req, res, next) => {
	const { username, avatar_url, name } = req.body;
	sendUser(username, avatar_url, name)
		.then(([user]) => {
			res.status(201).send({ user });
		})
		.catch(next);
};
