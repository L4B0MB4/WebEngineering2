import Request from "./request";
import crypto from "crypto";
import BlockchainWrapper from "./BlockchainWrapper";
import fetch from "isomorphic-unfetch";
import queryString from "query-string";
import _ from "lodash";

const hash = block => {
  return crypto
    .createHash("sha256")
    .update(block)
    .digest("hex");
};
const baseUrl = "http://localhost:3000";
const request = new Request(baseUrl);
const blockchainWrapper = new BlockchainWrapper();
class Ninegag {
  globalPosts = [];

  async crawl() {
    let after = "";
    do {
      let url = "https://9gag.com/v1/group-posts/group/default/type/hot?" + after;
      let res = await this.callFetch(url, "GET");
      res = JSON.parse(res.data);
      after = res.data.nextCursor;
      let posts = res.data.posts;
      posts = _.filter(posts, { nsfw: 0, type: "Photo" });
      posts = posts.map(item => {
        item.image = item.images.image700.webpUrl;
        item.images = undefined;
        return { title: item.title, image: item.image };
      });
      this.globalPosts.push(...posts);
    } while (this.globalPosts.length < 20);
  }

  async main() {
    let res = await request.callLogin({
      password: hash("9gag"),
      username: "9gag"
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
    for (let i = 0; i < this.globalPosts.length; i++) {
      let alreadyPosted = false;
      for (let j = 0; j < blockchainWrapper.blockchain.chain.length; j++) {
        let block = blockchainWrapper.blockchain.chain[j];
        let transaction = block.transactions[0];
        if (transaction && transaction.type == "content" && transaction.data.text == this.globalPosts[i].title) {
          alreadyPosted = true;
          j = blockchainWrapper.blockchain.chain.length;
        }
      }
      if (!alreadyPosted) {
        let p = this.globalPosts[i];
        res = await request.callUploadExternalFile(p.image);
        if (res.data && res.data.filename) {
          blockchainWrapper.newTransaction("content", { text: p.title, picture: res.data.filename }, () => {
            console.log("success!");
          });
        }
      }
    }
  }

  async callFetch(url, method, body) {
    let customPath = "";
    const config = {
      method
    };
    if (config.method !== "GET") {
      config.body = JSON.stringify(body);
    } else if (body) {
      customPath = `?${queryString.stringify(body)}`;
    }
    try {
      const res = await fetch(`${url}${customPath}`, config);
      const data = await res.text();
      return {
        data,
        response: res
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
const ngag = new Ninegag();
main();
async function main() {
  await ngag.crawl();
  await ngag.main();
}
