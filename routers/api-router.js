const apiRouter = require('express').Router();
const topicsRouter = require('../routers/topics-router');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
