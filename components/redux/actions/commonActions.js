export const actionTypes = {
  RECEIVE_INFO: "RECEIVE_INFO",
  RECEIVE_BLOCKCHAIN_FEED: "RECEIVE_BLOCKCHAIN_FEED",
  RECEIVE_USER :"RECEIVE_USER",
  RECEIVE_VISITED_USER :"RECEIVE_VISITED_USER"
};

export function receiveBlockchainFeed(payload) {
  return {
    type: actionTypes.RECEIVE_BLOCKCHAIN_FEED,
    payload,
  };
}

export function receiveUser(payload) {
  return {
    type: actionTypes.RECEIVE_USER,
    payload,
  };
}
export function receiveVisitedUser(payload) {
  return {
    type: actionTypes.RECEIVE_VISITED_USER,
    payload,
  };
}


