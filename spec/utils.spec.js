const { expect } = require('chai');
const {
	formatDates,
	makeRefObj,
	formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
	it('when passed an array of objects, returns a new array', () => {
		const arr = [
			{
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'body',
				created_at: 1416140514171
			}
		];
		expect(formatDates(arr)).to.be.an('array');
	});
	it('when passed an array of a single object, returns new array of object with timestamp converted into js date obj', () => {
		const arr = [
			{
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'body',
				created_at: 1416140514171
			}
		];
		let formatted = formatDates(arr);
		expect(formatted[0]).to.contain.keys(
			'title',
			'topic',
			'author',
			'body',
			'created_at'
		);
		expect(formatted[0].created_at).to.be.an.instanceOf(Date);
	});
	it('when passed an array of multiple objects, returns all objects with time formatted', () => {
		const arr = [
			{
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'body',
				created_at: 1542284514171
			},
			{
				title: 'title2',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'body',
				created_at: 1416140514171
			}
		];
		expect(formatDates(arr)[1].created_at).to.be.an.instanceOf(Date);
	});
	it('doesnt alter original array', () => {
		const arr = [
			{
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'body',
				created_at: 1416140514171
			}
		];
		formatDates(arr);
		expect(arr).to.eql([
			{
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'body',
				created_at: 1416140514171
			}
		]);
	});
});

describe('makeRefObj', () => {
	it('when passed an array of objects, returns an object', () => {
		const arr = [
			{
				article_id: 1,
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		expect(makeRefObj(arr, 'article_id', 'title')).to.be.an('object');
	});
	it('when passed an array containing a single object, returns an object with the key of the article id and the value of the title', () => {
		const arr = [
			{
				article_id: 1,
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		expect(makeRefObj(arr, 'article_id', 'title')).to.eql({
			'Living in the shadow of a great man': 1
		});
	});
	it('when passed an array of multiple objects returns ref obj with id/title pairs', () => {
		const arr = [
			{
				article_id: 1,
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			},
			{
				article_id: 2,
				title: 'Title',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		expect(makeRefObj(arr, 'article_id', 'title')).to.eql({
			'Living in the shadow of a great man': 1,
			Title: 2
		});
	});
	it('doesnt alter orginal array', () => {
		const arr = [
			{
				article_id: 1,
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		makeRefObj(arr, 'article_id', 'title');
		expect(arr).to.eql([
			{
				article_id: 1,
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		]);
	});
});

describe('formatComments', () => {
	it('when passed an array of objects and a reference object, returns an array of objects', () => {
		const arr = [
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		];
		const ref = { 'Living in the shadow of a great man': 1 };
		expect(formatComments(arr, ref)).to.be.an('array');
	});
	it('when passed an array of a single object and a reference object, returns object in an array with belongs to changed to article id and created_by changed to author', () => {
		const arr = [
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		];
		const ref = { 'Living in the shadow of a great man': 1 };
		expect(formatComments(arr, ref)).to.eql([
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				article_id: 1,
				author: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		]);
	});
	it('when passed an array of multiple objects and a reference object, replaces all instances of belongs to with article id and key value created_by changed to author', () => {
		const arr = [
			{
				body:
					"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
				belongs_to: 'Title',
				created_by: 'butter_bridge',
				votes: 16,
				created_at: 1511354163389
			},
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		];
		const ref = {
			'Living in the shadow of a great man': 1,
			Title: 2
		};
		expect(formatComments(arr, ref)).to.eql([
			{
				body:
					"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
				article_id: 2,
				author: 'butter_bridge',
				votes: 16,
				created_at: 1511354163389
			},
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				article_id: 1,
				author: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		]);
	});
	it('does not alter original array', () => {
		const arr = [
			{
				body:
					"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
				belongs_to: 'Title',
				created_by: 'butter_bridge',
				votes: 16,
				created_at: 1511354163389
			},
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		];
		const ref = {
			'Living in the shadow of a great man': 1,
			Title: 2
		};
		formatComments(arr, ref);
		expect(arr).to.eql([
			{
				body:
					"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
				belongs_to: 'Title',
				created_by: 'butter_bridge',
				votes: 16,
				created_at: 1511354163389
			},
			{
				body:
					'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
				belongs_to: 'Living in the shadow of a great man',
				created_by: 'butter_bridge',
				votes: 14,
				created_at: 1479818163389
			}
		]);
	});
});
