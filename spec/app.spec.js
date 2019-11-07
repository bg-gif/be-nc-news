process.env.NODE_ENV = 'test';
const chai = require('chai');
const { expect } = require('chai');
const chaiSorted = require('chai-sorted');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

chai.use(chaiSorted);

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
			it('status: 200, returns a JSON object with all available endpoints', () => {
				return request
					.get('/api/')
					.expect(200)
					.then(({ body }) => {
						expect(body).to.be.an('object');
					});
			});
			describe('/comments', () => {
				describe('/:commentId', () => {
					describe('PATCH', () => {
						it('status:200, works with negative numbers', () => {
							return request
								.patch('/api/comments/1')
								.send({ inc_votes: 10 })
								.expect(200)
								.then(({ body: { updatedComment } }) => {
									expect(updatedComment).to.eql({
										comment_id: 1,
										author: 'butter_bridge',
										article_id: 9,
										votes: 26,
										created_at: '2017-11-22T12:36:03.389Z',
										body:
											"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
									});
								});
						});
						it('status:200, updates comment and returns updated comment', () => {
							return request
								.patch('/api/comments/1')
								.send({ inc_votes: -10 })
								.expect(200)
								.then(({ body: { updatedComment } }) => {
									expect(updatedComment).to.eql({
										comment_id: 1,
										author: 'butter_bridge',
										article_id: 9,
										votes: 6,
										created_at: '2017-11-22T12:36:03.389Z',
										body:
											"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
									});
								});
						});
						it('status:400, invalid comment id responds with bad request', () => {
							return request
								.patch('/api/comments/one')
								.send({ inc_votes: 10 })
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
						it('status:404, valid but non existent id responds with bad request', () => {
							return request
								.patch('/api/comments/1233456')
								.expect(404)
								.send({ inc_votes: 10 })
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Not Found');
								});
						});
						it('status:400, passing wrong vote data type', () => {
							return request
								.patch('/api/comments/one')
								.send({ inc_votes: 'ten' })
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
						it('status:400, wrong key value in send data', () => {
							return request
								.patch('/api/comments/one')
								.send({ elephants: 10 })
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
					});
					describe('DELETE', () => {
						it('status:204, returns no content', () => {
							return request.delete('/api/comments/1').expect(204);
						});
						it('status:400, bad comment id type', () => {
							return request
								.delete('/api/comments/one')
								.expect(400)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Bad Request');
								});
						});
						it('status:404, valid but non existent comment id', () => {
							return request
								.delete('/api/comments/99999')
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Not Found');
								});
						});
					});
					describe('INVALID METHODS', () => {
						it('status: 405, reponds with method not allowed', () => {
							const methodArr = ['post', 'put', 'get'];
							const promiseArr = methodArr.map(method => {
								return request[method]('/api/comments/1')
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
									expect(msg).to.equal('Not Found');
								});
						});
						it('status:404, invalid username data type', () => {
							return request
								.get('/api/users/11223')
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Not Found');
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
									'created_at',
									'comment_count'
								);
							});
					});
					it('status:200, default sort of date, descending', () => {
						return request
							.get('/api/articles')
							.expect(200)
							.then(({ body: { articles } }) => {
								expect(articles).to.be.descendingBy('created_at');
							});
					});
					it('status:200, sort by query', () => {
						return request
							.get('/api/articles?sort_by=votes')
							.expect(200)
							.then(({ body: { articles } }) => {
								expect(articles).to.be.descendingBy('votes');
							});
					});
					it('status:400, bad sort query', () => {
						return request
							.get('/api/articles?sort_by=botes')
							.expect(400)
							.then(({ body: { msg } }) => {
								expect(msg).to.equal('Bad Request');
							});
					});
					it('status:200, order by query, defaulting to desc', () => {
						return request
							.get('/api/articles?order=desc')
							.expect(200)
							.then(({ body: { articles } }) => {
								expect(articles).to.be.descendingBy('created_at');
							});
					});
					it('status:200, allows query of author and returns articles by that author', () => {
						return request
							.get('/api/articles?author=icellusedkars')
							.expect(200)
							.then(({ body: { articles } }) => {
								expect(articles).to.have.length(6);
							});
					});
					it('status:200, allows query of topic and returns articles on that topic', () => {
						return request
							.get('/api/articles?topic=mitch')
							.expect(200)
							.then(({ body: { articles } }) => {
								expect(articles).to.have.length(11);
							});
					});
					it('status:404, invalid author query', () => {
						return request
							.get('/api/articles?author=iellusedkars')
							.expect(404)
							.then(({ body: { msg } }) => {
								expect(msg).to.equal('Not Found');
							});
					});
					it('status:404, invalid topic query', () => {
						return request
							.get('/api/articles?topic=bitch')
							.expect(404)
							.then(({ body: { msg } }) => {
								expect(msg).to.equal('Not Found');
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
								.get('/api/articles/39786')
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
						it('status:200, works with negative numbers, responds with amended article object', () => {
							return request
								.patch('/api/articles/1')
								.send({ inc_votes: -100 })
								.expect(200)
								.then(({ body: { updatedArticle } }) => {
									expect(updatedArticle).to.eql({
										article_id: 1,
										title: 'Living in the shadow of a great man',
										body: 'I find this existence challenging',
										topic: 'mitch',
										author: 'butter_bridge',
										created_at: '2018-11-15T12:21:54.171Z',
										votes: 0
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
								.patch('/api/articles/2543')
								.send({ inc_votes: 10 })
								.expect(404)
								.then(({ body: { msg } }) => {
									expect(msg).to.equal('Not Found');
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
					describe('/:article_id/comments', () => {
						describe('GET', () => {
							it('status:200, returns array of commments with appropriate properties', () => {
								return request
									.get('/api/articles/1/comments')
									.expect(200)
									.then(({ body: { comments } }) => {
										expect(comments).to.be.an('array');
										expect(comments).to.have.length(5);
										expect(comments[0]).to.include.keys(
											'author',
											'votes',
											'comment_id',
											'body',
											'created_at'
										);
									});
							});
							it('status:400, invalid article id', () => {
								return request
									.get('/api/articles/steve/comments')
									.expect(400)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Bad Request');
									});
							});
							it('status:404, article does not exist', () => {
								return request
									.get('/api/articles/23132/comments')
									.expect(404)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Not Found');
									});
							});
							it('status:200, default sort to created at', () => {
								return request
									.get('/api/articles/1/comments')
									.expect(200)
									.then(({ body: { comments } }) => {
										expect(comments).to.be.sortedBy('created_at');
									});
							});
							it('status:200, sorts by query', () => {
								return request
									.get('/api/articles/1/comments?sort_by=votes')
									.expect(200)
									.then(({ body: { comments } }) => {
										expect(comments).to.be.sortedBy('votes');
									});
							});
							it('status:400, bad sort query', () => {
								return request
									.get('/api/articles/1/comments?sort_by=botes')
									.expect(400)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Bad Request');
									});
							});
							it('status:200, default order of desc', () => {
								return request
									.get('/api/articles/1/comments?order=desc')
									.expect(200)
									.then(({ body: { comments } }) => {
										expect(comments).to.be.descendingBy('created_at');
									});
							});
							it('status:200, order by query', () => {
								return request
									.get('/api/articles/1/comments?order=asc')
									.expect(200)
									.then(({ body: { comments } }) => {
										expect(comments).to.be.ascendingBy('created_at');
									});
							});
						});
						describe('POST', () => {
							it('status:201, responds with posted comment', () => {
								return request
									.post('/api/articles/1/comments')
									.send({
										username: 'icellusedkars',
										body: 'This was proper bad'
									})
									.expect(201)
									.then(({ body: { postedComment } }) => {
										expect(postedComment).to.include.keys(
											'author',
											'article_id',
											'votes',
											'comment_id',
											'body'
										);
									});
							});
							it('status:404, missing username', () => {
								return request
									.post('/api/articles/1/comments')
									.send({ body: 'This were not good' })
									.expect(404)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Not Found');
									});
							});
							it('status:400, invalid article id', () => {
								return request
									.post('/api/articles/steve/comments')
									.send({
										body: 'This were not good',
										username: 'icellusedkars'
									})
									.expect(400)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Bad Request');
									});
							});
							it('status:404, Invalid username on body', () => {
								return request
									.post('/api/articles/1/comments')
									.send({ body: 'This were not good', username: 123 })
									.expect(404)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Not Found');
									});
							});
							it('status:400, Missing body on comment', () => {
								return request
									.post('/api/articles/1/comments')
									.send({ username: 'icellusedkars' })
									.expect(400)
									.then(({ body: { msg } }) => {
										expect(msg).to.equal('Bad Request');
									});
							});
						});
						describe('INVALID METHODS', () => {
							it('status: 405, reponds with method not allowed', () => {
								const methodArr = ['patch', 'put', 'delete'];
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
});
