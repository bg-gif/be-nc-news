exports.up = function(knex) {
	return knex.schema.createTable('topics', table => {
		table.string('slug').primary();
		table.string('description').notNullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('topics');
};
