import crypto from "crypto";

const hash = (block) => {
  return crypto
    .createHash("sha256")
    .update(block)
    .digest("hex");
};

module.exports = {
  hash
};
