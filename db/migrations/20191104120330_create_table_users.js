exports.up = function(knex) {
	return knex.schema.createTable('users', table => {
		table.string('username').primary();
		table.string('avatar_url').notNullable();
		table.string('name').notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('users');
};
