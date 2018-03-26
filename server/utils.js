const _ = require("lodash");
const {findUsersByPublicKey} = require("./database");

async function createFeed(req, res, blockchain) {
  let feed = blockchain.map(item=>{
    return {...item.transactions[0],previousHash:item.previousHash}
  });
  feed = _.filter(feed, { value:{type:"content"} });
  feed = feed.map(item=>{
    let x= {...item.value,recipient:item.recipient, previousHash:item.previousHash};
    return x;
  });
  feed.slice(Math.max(feed.length - 10, 1))


  let publicKeys = feed.map(item =>item.recipient);
  let users = await findUsersByPublicKey(publicKeys);
  feed = feed.map(block => mergeUserToBlock(block,users));

  return feed.reverse();
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


function broadcastOrEmit(socket,type,data,socketcount)
{
  if(socketcount<2)
  {
    socket.emit(type,data);
  }
  else{
    socket.broadcast.emit(type,data);
  }
}



function getLikesByPreviousHash(blockchain, hash ="9924f646e3438ff6c80f88a5878b959c55e840a66a74d088a864e2c89469cda5")
{
  blockchain = blockchain.map(item=>{
    return {...item.transactions[0],previousHash:item.previousHash}
  });
  let arr = _.filter(blockchain,{value:{type:"like",data:{previousHash:hash}}})
  return  arr;
}


module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit,
  getLikesByPreviousHash
};
