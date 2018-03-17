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

  callGetItems(all) {
    if (all === true) return this.callFetch('GET', '/admin/getItems');
    return this.callFetch('GET', '/getItems');
  }

  callGetItemDetails(query) {
    return this.callFetch('GET', '/getItemDetails', query);
  }

  callGetProfile() {
    return this.callFetch('GET', '/profile');
  }

  callInsertItem(query) {
    return this.callFetch('POST', '/admin/item', query);
  }

  callUpdateItem(query) {
    return this.callFetch('PUT', '/admin/item', query);
  }

  callDeleteItem(query) {
    return this.callFetch('DELETE', '/admin/item', query);
  }
}

export default Request;
