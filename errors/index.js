exports.handle500s = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Server Error' });
};

exports.handle405s = (req, res, next) => {
	res.status(405).send({ msg: 'Method not allowed' });
};

exports.handle404s = (req, res, next) => {
	res.status(404).send({ msg: 'Path not found' });
};
