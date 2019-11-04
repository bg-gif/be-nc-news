exports.formatDates = list => {
	return list.map(article => {
		const newArticle = JSON.parse(JSON.stringify(article));
		let date = newArticle.created_at;
		dateObj = new Date(date);
		newArticle.created_at = dateObj;
		return newArticle;
	});
};

exports.makeRefObj = (data, arg1, arg2) => {
	const ref = {};
	data.forEach(object => {
		ref[object[arg2]] = object[arg1];
	});
	return ref;
};

exports.formatComments = (comments, articleRef) => {
	return comments.map(object => {
		const newObj = JSON.parse(JSON.stringify(object));
		if (articleRef[newObj.belongs_to]) {
			newObj.article_id = articleRef[newObj.belongs_to];
			newObj.author = newObj.created_by;
			delete newObj.created_by;
			delete newObj.belongs_to;
			return newObj;
		}
	});
};
