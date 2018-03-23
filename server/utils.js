const _ = require("lodash");
const {findUsersByPublicKey} = require("./database");

async function createFeed(req, res, blockchain) {
  let feed = blockchain.map(item=>item.transactions[0]);
  feed = _.filter(feed, { value:{type:"content"} });
  feed = feed.map(item=>{
    let x= {...item.value,recipient:item.recipient};
    return x;
  });
  feed.slice(Math.max(feed.length - 10, 1))


  let publicKeys = feed.map(item =>item.recipient);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block,users));

  return feed;
}

function mergeUserToBlock(block,users)
{
  for(let i =0; i<users.length;i++)
  {
    if(block.recipient === users[i].publicKey)
    {
      block.user = users[i];
      return block;
    }
  }
  return block;
}


function handleLogin (err, user, info, req, res) {
  if (err) {
    res.json({ type: "error", message: "Fehler beim Login" });
  }
  if (!user) {
    res.json({ type: "error", message: "Fehler beim Login" });
  }
  req.logIn(user, function(err) {
    if (err) {
      res.json({ type: "error", message: "Fehler beim Login" });
    }
    return res.json({
      type: "success",
      message: "Erfolgreich eingeloggt"
    });
  });
}
module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock
};
