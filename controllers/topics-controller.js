const { fetchAllTopics, sendTopic } = require("../models/topics-model");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  sendTopic(slug, description)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
