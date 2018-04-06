import crypto from "crypto";
import Request from "./request";
const request = new Request();

const hash = block => {
  return crypto
    .createHash("sha256")
    .update(block)
    .digest("hex");
};

const getDate = timestamp => {
  let d = new Date(timestamp);
  let hrs = d.getHours();
  let mins = d.getMinutes();
  let days = d.getDate();
  let mnth = d.getMonth() + 1;
  let year = d.getFullYear();
  if (hrs < 10) hrs = "0" + hrs;
  if (mins < 10) mins = "0" + mins;
  if (days < 10) days = "0" + days;
  if (mnth < 10) mnth = "0" + mnth;
  return hrs + ":" + mins + " " + days + "." + mnth + "." + year;
};

const handleLike = async (blockchainWrapper, username, previousHash, callback) => {
  let publicKey = (await request.callGetPublicKey({ username })).data.publicKey;
  if (!blockchainWrapper.alreadyLiked(previousHash, publicKey)) {
    blockchainWrapper.newTransaction(
      "like",
      {
        previousHash,
        userKey: publicKey
      },
      callback
    );
  }
};

const handleShare = async (blockchainWrapper, username, item, callback) => {
  if (item.shared) return;
  let publicKey = (await request.callGetPublicKey({ username })).data.publicKey;
  blockchainWrapper.newTransaction(
    "share",
    {
      previousHash: item.previousHash,
      userKey: publicKey
    },
    callback
  );
};

module.exports = {
  hash,
  getDate,
  handleLike,
  handleShare
};
