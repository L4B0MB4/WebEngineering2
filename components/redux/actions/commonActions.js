export const actionTypes = {
  RECEIVE_INFO: "RECEIVE_INFO",
  RECEIVE_BLOCKCHAIN_FEED: "RECEIVE_BLOCKCHAIN_FEED",
  RECEIVE_USER: "RECEIVE_USER",
  RECEIVE_VISITED_USER: "RECEIVE_VISITED_USER",
  RECEIVE_VISITED_USER_CONTENT: "RECEIVE_VISITED_USER_CONTENT",
  RECEIVE_VISITED_USER_FOLLOWER: "RECEIVE_VISITED_USER_FOLLOWER",
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
