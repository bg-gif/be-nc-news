const { sendLogin } = require('../models/login-model');
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

exports.postLogin = (req, res, next) => {
	const { username, body } = req.body;
	sendLogin(username, body).then(user => {
		const token = jwt.sign(
			{ user: user.username, iat: Date.now() },
			JWT_SECRET
		);
		res.send({ token });
	});
};

exports.verify = (req, res, next) => {
	console.log(req.headers);
	const { authorization } = req.headers;
	const token = authorization.split(' ')[1];
	console.log(token, '<token');
	jwt.verify(token, JWT_SECRET, (err, res) => {
		if (err) next({ status: 401, msg: 'Unauthorized' });
		else next();
	});
};
