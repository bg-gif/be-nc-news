exports.up = function(knex) {
	return knex.schema.createTable('comments', table => {
		table.increments('comment_id');
		table
			.string('author')
			.references('username')
			.inTable('users');
		table
			.integer('article_id')
			.references('article_id')
			.inTable('articles');
		table.integer('votes').defaultTo(0);
		table.timestamp('created_at');
		table.text('body');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('comments');
};
