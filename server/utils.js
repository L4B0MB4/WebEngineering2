const _ = require("lodash");

function createFeed(req, res, blockchain) {
  let feed = blockchain.map(item=>item.transactions[0]);
  feed = _.filter(feed, { value:{type:"content"} });
  feed = feed.map(item=>item.value);
  feed.slice(Math.max(feed.length - 10, 1))
  return feed;
}

module.exports = {
  createFeed
};
