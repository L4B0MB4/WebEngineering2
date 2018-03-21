export const actionTypes = {
  RECEIVE_INFO: "RECEIVE_INFO",
  RECEIVE_BLOCKCHAIN_FEED: "RECEIVE_BLOCKCHAIN_FEED"
};

export function receiveBlockchainFeed(payload) {
  return {
    type: actionTypes.RECEIVE_BLOCKCHAIN_FEED,
    payload,
  };
}