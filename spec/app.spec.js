process.env.NODE_ENV = 'test';
const chai = require('chai');
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

beforeEach(() => {
	return connection.seed.run();
});

after(() => {
	return connection.destroy(() => {
		console.log('Connection Ended');
	});
});

describe('app', () => {
	describe('/path-not found', () => {
		it('status:404, responds with path not found', () => {
			return request
				.get('/pathdoesnotexist')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).to.equal('Path not found');
				});
		});
		describe('/api', () => {
			describe('/topics', () => {
				describe('GET', () => {
					it('status:200, responds with an object with key topics and value of array of topics', () => {
						return request
							.get('/api/topics')
							.expect(200)
							.then(({ body: { topics } }) => {
								expect(topics).to.be.an('array');
								expect(topics[0]).to.contain.keys('slug', 'description');
							});
					});
				});
				describe('INVALID METHODS', () => {
					it('status: 405, reponds with method not allowed', () => {
						const methodArr = ['post', 'put', 'patch', 'delete'];
						const promiseArr = methodArr.map(method => {
							return request[method]('/api/topics')
								.expect(405)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Method not allowed');
								});
						});
						return Promise.all[promiseArr];
					});
				});
			});
			describe('/users', () => {
				describe('GET', () => {
					it('status:200, responds with an array of all users on key of users', () => {
						return request
							.get('/api/users')
							.expect(200)
							.then(({ body: { users } }) => {
								expect(users).to.be.an('array');
								expect(users[0]).to.include.keys(
									'username',
									'avatar_url',
									'name'
								);
							});
					});
				});
				describe('INVALID METHODS', () => {
					it('status: 405, reponds with method not allowed', () => {
						const methodArr = ['post', 'put', 'patch', 'delete'];
						const promiseArr = methodArr.map(method => {
							return request[method]('/api/users')
								.expect(405)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Method not allowed');
								});
						});
						return Promise.all[promiseArr];
					});
				});
				describe('/:username', () => {
					describe('GET', () => {
						it('status:200, responds with object with key user with value of user object', () => {
							return request
								.get('/api/users/butter_bridge')
								.expect(200)
								.then(({ body: { user } }) => {
									expect(user).to.be.an('object');
									expect(user).to.contain.keys(
										'username',
										'avatar_url',
										'name'
									);
									expect(user).to.eql({
										username: 'butter_bridge',
										name: 'jonny',
										avatar_url:
											'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
									});
								});
						});
						it('status:404, responds with User does not exist', () => {
							return request
								.get('/api/users/stevey')
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('User does not exist');
								});
						});
					});
					describe('INVALID METHODS', () => {
						it('status: 405, reponds with method not allowed', () => {
							const methodArr = ['post', 'put', 'patch', 'delete'];
							const promiseArr = methodArr.map(method => {
								return request[method]('/api/users')
									.expect(405)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Method not allowed');
									});
							});
							return Promise.all[promiseArr];
						});
					});
				});
			});
			describe('/articles', () => {
				describe('GET', () => {
					it('status:200, responds with an object with key articles and value of array of articles', () => {
						return request
							.get('/api/articles')
							.expect(200)
							.then(({ body: { articles } }) => {
								expect(articles).to.be.an('array');
								expect(articles[0]).to.contain.keys(
									'article_id',
									'title',
									'body',
									'votes',
									'topic',
									'author',
									'created_at'
								);
							});
					});
				});
				describe('INVALID METHODS', () => {
					it('status: 405, reponds with method not allowed', () => {
						const methodArr = ['post', 'put', 'patch', 'delete'];
						const promiseArr = methodArr.map(method => {
							return request[method]('/api/articles')
								.expect(405)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Method not allowed');
								});
						});
						return Promise.all[promiseArr];
					});
				});
				describe('/:article_id', () => {
					describe('GET', () => {
						it('status:200, returns specified article with votes and comments counted from comments table', () => {
							return request
								.get('/api/articles/1')
								.expect(200)
								.then(({ body: { article } }) => {
									expect(article).to.eql({
										article_id: 1,
										title: 'Living in the shadow of a great man',
										body: 'I find this existence challenging',
										votes: 100,
										topic: 'mitch',
										author: 'butter_bridge',
										created_at: '2018-11-15T12:21:54.171Z',
										comment_count: '13'
									});
								});
						});
						it('status:404, responds with Article does not exist', () => {
							return request
								.get('/api/articles/3')
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Article does not exist');
								});
						});
						it('status:400, responds with bad request on wrong datatype in endpoint value', () => {
							return request
								.get('/api/articles/two')
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
					});
					describe('PATCH', () => {
						it('status:200, responds with amended article object', () => {
							return request
								.patch('/api/articles/1')
								.send({ inc_votes: 100 })
								.expect(200)
								.then(({ body: { updatedArticle } }) => {
									expect(updatedArticle).to.eql({
										article_id: 1,
										title: 'Living in the shadow of a great man',
										body: 'I find this existence challenging',
										topic: 'mitch',
										author: 'butter_bridge',
										created_at: '2018-11-15T12:21:54.171Z',
										votes: 200
									});
								});
						});
						it('status:400, responds with bad request on passing wrong value', () => {
							return request
								.patch('/api/articles/1')
								.send({ inc_votes: 'column' })
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
						it('status:400, responds with bad request on wrong datatype in endpoint value', () => {
							return request
								.patch('/api/articles/two')
								.send({ inc_votes: 100 })
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
						it('status:404, responds with article does not exist on incorrect article id', () => {
							return request
								.get('/api/articles/2543')
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Article does not exist');
								});
						});
					});
					describe('INVALID METHODS', () => {
						it('status: 405, reponds with method not allowed', () => {
							const methodArr = ['post', 'put', 'delete'];
							const promiseArr = methodArr.map(method => {
								return request[method]('/api/articles')
									.expect(405)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Method not allowed');
									});
							});
							return Promise.all[promiseArr];
						});
					});
				});
			});
		});
	});
});
