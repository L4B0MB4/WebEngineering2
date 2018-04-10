import Request from "./request";
import crypto from "crypto";
import BlockchainWrapper from "./BlockchainWrapper";

const hash = block => {
  return crypto
    .createHash("sha256")
    .update(block)
    .digest("hex");
};
const baseUrl = "http://localhost:3000";
const request = new Request(baseUrl);
const blockchainWrapper = new BlockchainWrapper();
main();
async function main() {
  let res = await request.callLogin({
    password: hash("lars"),
    username: "Lars"
  });
  res = await request.callMainPage();
  let privateKey = res.data.query.user.privateKey;
  blockchainWrapper.init(
    privateKey,
    data => {
      console.log("update");
    },
    data => {
      console.log("onNews=");
      console.log(data);
    }
  );
}
