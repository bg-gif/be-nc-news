process.env.NODE_ENV = 'test';
const chai = require('chai');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

after(() => {
	return connection.destroy(() => {
		console.log('Connection Ended');
	});
});

describe('app', () => {
	describe('/path-not found', () => {
		it('status:404, responds with path not found', () => {
			return request(app)
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
						return request(app)
							.get('/api/topics')
							.expect(200)
							.then(({ body: { topics } }) => {
								expect(topics).to.be.an('array');
								expect(topics[0]).to.contain.keys('slug', 'description');
							});
					});
				});
			});
		});
	});
});
