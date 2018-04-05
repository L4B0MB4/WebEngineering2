import * as serverutils from "./serverutils";
import * as blockchainutils from "./blockchainutils";
import * as websocketutils from "./websockets";
import * as databaseutils from "./database";
const path = require("path");

async function setUpMain(req, res, blockchain) {
  const following = await blockchainutils.getFollowing(blockchain.chain, req.user.publicKey);
  let user = blockchainutils.getUserWithProfilePicture(blockchain.chain, req.user);
  user.ansehen = blockchainutils.getAnsehen(blockchain.chain, user.publicKey);
  const query = {
    blockchainFeed: await blockchainutils.createFollowerFeed(req, res, blockchain.chain, following),
    userContent: await blockchainutils.getContentOfUser(blockchain.chain, req.user.publicKey),
    followers: await blockchainutils.getFollower(blockchain.chain, req.user.publicKey),
    ansehen: blockchainutils.getAnsehen(blockchain.chain, req.user.publicKey),
    user
  };
  return query;
}

async function setUpVisitPage(req, res, blockchain) {
  let visitedUser = await databaseutils.findPublicKeyByUsername(req.params.username);
  visitedUser = blockchainutils.getUserWithProfilePicture(blockchain.chain, visitedUser);
  visitedUser.ansehen = blockchainutils.getAnsehen(blockchain.chain, visitedUser.publicKey);
  let user = blockchainutils.getUserWithProfilePicture(blockchain.chain, req.user);
  user.ansehen = blockchainutils.getAnsehen(blockchain.chain, user.publicKey);
  const query = {
    user,
    visitedUser
  };
  return query;
}

function setUpPictureUpload(req, res) {
  if (!req.files || !req.files.uploadedFile) return res.status(400).json({ message: "No / Wrong files were uploaded." });
  const file = req.files.uploadedFile;
  const filename = file.md5 + Date.now();
  const destination = path.join(__dirname, "..", "temp", filename);
  file.mv(destination, async function(err) {
    if (err) return res.status(500).send(err);
    let allowed = await serverutils.checkFileType(destination);
    if (allowed) {
      return res.send({ filename });
    } else {
      fs.unlink(destination);
      return res.status(500).send(err);
    }
  });
}

module.exports = { setUpMain, setUpVisitPage, setUpPictureUpload };
