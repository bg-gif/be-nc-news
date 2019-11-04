exports.up = function(knex) {
	console.log('creating table - articles');
	return knex.schema.createTable('articles', table => {
		table.increments('article_id');
		table.string('title');
		table.text('body');
		table.integer('votes').defaultTo(0);
		table
			.string('topic')
			.references('slug')
			.inTable('topics');
		table
			.string('author')
			.references('username')
			.inTable('users');
		table.timestamp('created_at');
	});
};

exports.down = function(knex) {
	console.log('dropping table - articles');
	return knex.schema.dropTableIfExists('articles');
};
