const connection = require('../db/connection');

exports.updateCommentById = (comment_id, newVotes) => {
	return connection('comments')
		.where('comment_id', comment_id)
		.modify(query => {
			if (newVotes) query.increment('votes', newVotes);
		})
		.returning('*');
};

exports.removeCommentById = comment_id => {
	return connection('comments')
		.del()
		.where('comment_id', comment_id);
};
