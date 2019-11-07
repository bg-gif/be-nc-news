exports.up = function(knex) {
	return knex.schema.createTable('articles', table => {
		table.increments('article_id');
		table.string('title').notNullable;
		table.text('body').notNullable;
		table.integer('votes').defaultTo(0);
		table
			.string('topic')
			.references('slug')
			.inTable('topics');
		table
			.string('author')
			.references('username')
			.inTable('users').notNullable;
		table.timestamp('created_at');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('articles');
};
