const express = require('express');
const app = express();
const apiRouter = require('./routers/api-router');
const {
	handle404s,
	handleCustoms,
	handle400s,
	handle500s,
	handle422s
} = require('./errors');

app.use(express.json());
app.use('/api', apiRouter);
app.use('/*', handle404s);
app.use(handle400s);
app.use(handle422s);
app.use(handleCustoms);
app.use(handle500s);

module.exports = app;
