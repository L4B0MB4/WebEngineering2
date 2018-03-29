import { actionTypes } from "../actions/commonActions";

const commonReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_BLOCKCHAIN_FEED:
      return Object.assign({}, state, { blockchainFeed: action.payload });
    case actionTypes.RECEIVE_USER:
      return Object.assign({}, state, { user: action.payload });
    case actionTypes.RECEIVE_VISITED_USER:
      return Object.assign({}, state, { visitedUser: action.payload });
    default:
      return state;
  }
};

export default commonReducer;
