import fetch from "isomorphic-unfetch";
import queryString from "query-string";

class Request {
  constructor(url) {
    this.url = url;
  }

  async callFetch(method, path, body, formencode) {
    let customPath = path;
    const config = {
      method,
      headers: {
        "content-type": formencode
          ? "application/x-www-form-urlencoded"
          : "application/json"
      },
      credentials: "same-origin" // wichtig für auth !!!
    };

    if (formencode) {
      config.body = queryString.stringify(body);
    } else if (config.method !== "GET") {
      config.body = JSON.stringify(body);
    } else if (body) {
      customPath = `${path}?${queryString.stringify(body)}`;
    }
    console.log(`${this.url ? this.url : ""}/api${customPath}`)
    try {
      const res = await fetch(
        `${this.url ? this.url : ""}/api${customPath}`,
        config
      );
      const data = await res.json();
      return {
        data,
        response: res
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  callgetBlockchainFeed() {
    return this.callFetch("GET", "/blockchain/feed");
  }

  callLogin(data) {
    return this.callFetch("POST", "/user/login", data, true);
  }
  callRegistration(data) {
    return this.callFetch("POST", "/user/register", data);
  }
  callGetPublicKey(data) {
    return this.callFetch("POST", "/user/getPublicKey", data);
  }
  callGetUserContent(username) {
    return this.callFetch("GET", "/blockchain/getUserFeed", { username });
  }
  callGetUserFollower(username) {
    return this.callFetch("GET", "/blockchain/getUserFollower", { username });
  }
}

export default Request;
