exports.up = function(knex) {
	console.log('creating table - topics');
	return knex.schema.createTable('topics', table => {
		table.string('slug').primary();
		table.string('description').notNullable();
	});
};

exports.down = function(knex) {
	console.log('dropping table - topics');
	return knex.schema.dropTableIfExists('topics');
};
