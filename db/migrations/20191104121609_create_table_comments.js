exports.up = function(knex) {
	return knex.schema.createTable('comments', table => {
		table.increments('comment_id');
		table
			.string('author')
			.references('username')
			.inTable('users')
			.notNullable();
		table
			.integer('article_id')
			.references('article_id')
			.inTable('articles')
			.notNullable();
		table.integer('votes').defaultTo(0);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.text('body').notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('comments');
};
