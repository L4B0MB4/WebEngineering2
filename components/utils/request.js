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
        "content-type": formencode ? "application/x-www-form-urlencoded" : "application/json"
      },
      credentials: "include" // wichtig für auth !!!
    };

    if (formencode) {
      config.body = queryString.stringify(body);
    } else if (config.method !== "GET") {
      config.body = JSON.stringify(body);
    } else if (body) {
      customPath = `${path}?${queryString.stringify(body)}`;
    }
    try {
      const res = await fetch(`${this.url ? this.url : ""}/api${customPath}`, config);
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

  async callFetchFileUpload(method, path, body) {
    let formdata = new FormData();
    formdata.append("uploadedFile", body);
    let customPath = path;
    const config = {
      method,
      credentials: "same-origin" // wichtig für auth !!!
    };
    if (config.method !== "GET") {
      config.body = formdata;
    } else if (body) {
      customPath = `${path}?${queryString.stringify(body)}`;
    }
    try {
      const res = await fetch(`${this.url ? this.url : ""}/api${customPath}`, config);
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

  callgetFollowerFeed() {
    return this.callFetch("GET", "/blockchain/getFollowerFeed");
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
  callGetUser() {
    return this.callFetch("GET", "/user/getUser");
  }
  callGetUserContent(username) {
    return this.callFetch("GET", "/blockchain/getUserFeed", { username });
  }
  callGetUserFollower(username) {
    return this.callFetch("GET", "/blockchain/getUserFollower", { username });
  }
  callUploadFile(file) {
    return this.callFetchFileUpload("POST", "/uploadPicture", file);
  }
  callGetUserLikes(username) {
    return this.callFetch("GET", "/blockchain/getUserLikes", { username });
  }
  callGetFeaturedUsers() {
    return this.callFetch("GET", "/blockchain/getFeaturedUsers");
  }
  callGetUserByUsername(username) {
    return this.callFetch("GET", "/user/search", { username });
  }
}

export default Request;
