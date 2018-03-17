export const actionTypes = {
  RECEIVE_INFO: "RECEIVE_INFO",
  RECEIVE_BLOCKCHAIN: "RECEIVE_BLOCKCHAIN"
};

export function receiveInfo(data) {
  return {
    type: actionTypes.RECEIVE_INFO,
    payload: {
      data
    }
  };
}