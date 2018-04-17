export const actionTypes = {
  RECEIVE_INFO: "RECEIVE_INFO",
  RECEIVE_BLOCKCHAIN_FEED: "RECEIVE_BLOCKCHAIN_FEED",
  RECEIVE_USER: "RECEIVE_USER",
  RECEIVE_VISITED_USER: "RECEIVE_VISITED_USER",
  RECEIVE_VISITED_USER_CONTENT: "RECEIVE_VISITED_USER_CONTENT",
  RECEIVE_VISITED_USER_FOLLOWER: "RECEIVE_VISITED_USER_FOLLOWER",
  RECEIVE_BLOCKCHAIN_WRAPPER: "RECEIVE_BLOCKCHAIN_WRAPPER",
  RECEIVE_LIKES: "RECEIVE_LIKES",
  RECEIVE_NEWS: "RECEIVE_NEWS",
  RECEIVE_FEATURED_USERS: "RECEIVE_FEATURED_USERS"
};

export function receiveBlockchainFeed(payload) {
  return {
    type: actionTypes.RECEIVE_BLOCKCHAIN_FEED,
    payload
  };
}

export function receiveUser(payload) {
  return {
    type: actionTypes.RECEIVE_USER,
    payload
  };
}
export function receiveVisitedUser(payload) {
  return {
    type: actionTypes.RECEIVE_VISITED_USER,
    payload
  };
}

export function receiveVisitedUserContent(payload) {
  return {
    type: actionTypes.RECEIVE_VISITED_USER_CONTENT,
    payload
  };
}

export function receiveVisitedUserFollower(payload) {
  return {
    type: actionTypes.RECEIVE_VISITED_USER_FOLLOWER,
    payload
  };
}

export function receiveBlockchainWrapper(payload) {
  return {
    type: actionTypes.RECEIVE_BLOCKCHAIN_WRAPPER,
    payload
  };
}

export function receiveLikes(payload) {
  return {
    type: actionTypes.RECEIVE_LIKES,
    payload
  };
}

export function receiveNews(payload) {
  return {
    type: actionTypes.RECEIVE_NEWS,
    payload
  };
}

export function receiveFeaturedUsers(payload) {
  return {
    type: actionTypes.RECEIVE_FEATURED_USERS,
    payload
  };
}
