exports.formatDates = list => {
	return list.map(article => {
		const newArticle = { ...article };
		let date = newArticle.created_at;
		dateObj = new Date(date);
		newArticle.created_at = dateObj;
		return newArticle;
	});
};

exports.makeRefObj = data => {
	const ref = {};
	data.forEach(object => {
		ref[object.title] = object.article_id;
	});
	return ref;
};

exports.formatComments = (comments, articleRef) => {
	return comments.map(object => {
		const newObj = { ...object };
		newObj.article_id = articleRef[newObj.belongs_to];
		newObj.author = newObj.created_by;
		delete newObj.created_by;
		delete newObj.belongs_to;
		return newObj;
	});
};
