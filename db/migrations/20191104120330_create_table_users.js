exports.up = function(knex) {
	console.log('creating table - users');
	return knex.schema.createTable('users', table => {
		table.string('username').primary();
		table.string('avatar_url').notNullable();
		table.string('name').notNullable();
	});
};

exports.down = function(knex) {
	console.log('dropping table - users');
	return knex.schema.dropTableIfExists('users');
};
