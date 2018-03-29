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

async function printFeedNewerThanTwoDays(req, res, blockchain)
{
    let feed = blockchain;
    //let blockchain = await printBlockchain();
    //let array = blockchain.blockchain;
    //let res = _.find(array, new Date('timestamp'): $lt: new Date(Date.now() - 1000*60*60*24*2}).timestamp; // $or: [{ email }, { name: body.name }]
    var elem;
    for(elem in feed) {
        if(!(new Date(feed[elem].timestamp) > Date.now() - 1000*60*60*24*2 )) feed[elem] = null;
    }
    var newArray = _.remove(feed, function(x) {
        return x != null;
    });
    //let res = _.filter(array, { 'timestamp': 'timestamp' > Date.now() - 1000*60*60*24*2}); // $or: [{ email }, { name: body.name }]
    //let date = new Date(res);
    console.log("This is the one and only chockblain: \n", newArray);
}



module.exports = {
  createFeed,
  handleLogin,
  mergeUserToBlock,
  broadcastOrEmit,
  printFeedNewerThanTwoDays
};
