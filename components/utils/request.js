import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';

class Request {
  constructor(url) {
    this.url = url;
  }

  async callFetch(method, path, body) {
    let customPath = path;
    const config = {
      method,
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'same-origin', // wichtig für auth !!!
    };

    if (config.method !== 'GET') {
      config.body = JSON.stringify(body);
    } else if (body) {
      customPath = `${path}?${queryString.stringify(body)}`;
    }

    try {
      const res = await fetch(`${this.url ? this.url : ''}/api${customPath}`, config);
      const data = await res.json();
      return {
        data,
        response: res,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  callgetBlockchainFeed() {
    return this.callFetch('GET', '/blockchain/feed');
  }

}

export default Request;
