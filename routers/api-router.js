const apiRouter = require('express').Router();
const topicsRouter = require('../routers/topics-router');
const usersRouter = require('../routers/users-router');
const articlesRouter = require('../routers/articles-router');
const commentsRouter = require('../routers/comments-router');
const ends = require('../endpoints.json');
const { handle405s } = require('../errors');

const endPoints = (req, res, next) => {
	res.status(200).send(ends);
};

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRoute
	.route('/')
	.get(endPoints)
	.all(handle405s);

module.exports = apiRouter;
